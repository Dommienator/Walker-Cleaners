import clientPromise from '../src/lib/mongodb';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = await clientPromise;
    const db = client.db('walker-cleaners');

    // GET - Fetch all packages
    if (req.method === 'GET') {
      const packages = await db.collection('packages')
        .find({})
        .sort({ id: 1 })
        .toArray();
      
      return res.status(200).json({ success: true, packages });
    }

    // POST - Add new package (admin only)
    if (req.method === 'POST') {
      const package_ = req.body;
      
      await db.collection('packages').insertOne(package_);
      
      return res.status(201).json({ success: true, package: package_ });
    }

    // PUT - Update package (admin only)
    if (req.method === 'PUT') {
      const package_ = req.body;
      
      await db.collection('packages').updateOne(
        { id: package_.id },
        { $set: package_ },
        { upsert: true }
      );
      
      return res.status(200).json({ success: true });
    }

    // DELETE - Delete package (admin only)
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      await db.collection('packages').deleteOne({ id: parseInt(id) });
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error', details: error.message });
  }
}