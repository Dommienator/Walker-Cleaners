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
    const packages = db.collection("packages");

    // GET - Fetch all packages
    if (req.method === "GET") {
      const allPackages = await packages.find({}).sort({ id: 1 }).toArray();
      return res.status(200).json({ success: true, packages: allPackages });
    }

    // POST - Create package
    if (req.method === "POST") {
      const pkg = req.body;
      await packages.insertOne(pkg);
      return res.status(201).json({ success: true, package: pkg });
    }

    // PUT - Update package
    if (req.method === "PUT") {
      const pkg = req.body;
      await packages.updateOne({ id: pkg.id }, { $set: pkg }, { upsert: true });
      return res.status(200).json({ success: true });
    }

    // DELETE - Delete package
    if (req.method === "DELETE") {
      const { id } = req.query;
      await packages.deleteOne({ id: parseInt(id) });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: error.message });
  }
};
