const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedClient = client;
  return client;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("walker-cleaners");
    const bookings = db.collection("bookings");

    // GET - Fetch bookings
    if (req.method === "GET") {
      const { phone, id } = req.query;

      if (phone) {
        const booking = await bookings.findOne({ phone });
        return res.status(200).json({ success: true, booking });
      }

      if (id) {
        const booking = await bookings.findOne({ id: parseInt(id) });
        return res.status(200).json({ success: true, booking });
      }

      // Return all bookings
      const allBookings = await bookings
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      return res.status(200).json({ success: true, bookings: allBookings });
    }

    // POST - Create booking
    if (req.method === "POST") {
      const booking = {
        ...req.body,
        id: Date.now(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await bookings.insertOne(booking);
      return res.status(201).json({ success: true, booking });
    }

    // PUT - Update booking
    if (req.method === "PUT") {
      const { id, status } = req.body;
      await bookings.updateOne(
        { id: parseInt(id) },
        { $set: { status, updatedAt: new Date().toISOString() } }
      );
      return res.status(200).json({ success: true });
    }

    // DELETE - Delete booking
    if (req.method === "DELETE") {
      const { id } = req.query;
      await bookings.deleteOne({ id: parseInt(id) });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: error.message });
  }
};
