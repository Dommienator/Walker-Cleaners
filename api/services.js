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

    // GET - Fetch all services
    if (req.method === 'GET') {
      const services = await db.collection('services')
        .find({})
        .sort({ id: 1 })
        .toArray();
      
      return res.status(200).json({ success: true, services });
    }

    // POST - Add new service (admin only)
    if (req.method === 'POST') {
      const service = req.body;
      
      await db.collection('services').insertOne(service);
      
      return res.status(201).json({ success: true, service });
    }

    // PUT - Update service (admin only)
    if (req.method === 'PUT') {
      const service = req.body;
      
      await db.collection('services').updateOne(
        { id: service.id },
        { $set: service },
        { upsert: true }
      );
      
      return res.status(200).json({ success: true });
    }

    // DELETE - Delete service (admin only)
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      await db.collection('services').deleteOne({ id: parseInt(id) });
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error', details: error.message });
  }
}