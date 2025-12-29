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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("walker-cleaners");
    const settings = db.collection("settings");

    // GET - Fetch settings
    if (req.method === "GET") {
      const siteSettings = await settings.findOne({ type: "site" });
      return res
        .status(200)
        .json({ success: true, settings: siteSettings || {} });
    }

    // PUT - Update settings
    if (req.method === "PUT") {
      const { headerImage } = req.body;
      await settings.updateOne(
        { type: "site" },
        { $set: { headerImage, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: error.message });
  }
};
