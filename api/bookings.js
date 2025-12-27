import clientPromise from '../src/lib/mongodb';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = await clientPromise;
    const db = client.db('walker-cleaners');

    // GET - Fetch all bookings (for admin)
    if (req.method === 'GET') {
      const { phone, bookingId } = req.query;

      // If searching by phone or booking ID
      if (phone || bookingId) {
        const query = phone 
          ? { phone: phone }
          : { id: parseInt(bookingId) };
        
        const booking = await db.collection('bookings').findOne(query);
        return res.status(200).json({ success: true, booking });
      }

      // Return all bookings (for admin)
      const bookings = await db.collection('bookings')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      return res.status(200).json({ success: true, bookings });
    }

    // POST - Create new booking
    if (req.method === 'POST') {
      const bookingData = req.body;
      
      const newBooking = {
        ...bookingData,
        id: Date.now(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await db.collection('bookings').insertOne(newBooking);

      // Trigger notification
      await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking: newBooking })
      });

      return res.status(201).json({ success: true, booking: newBooking });
    }

    // PUT - Update booking status (for admin)
    if (req.method === 'PUT') {
      const { id, status } = req.body;

      await db.collection('bookings').updateOne(
        { id: parseInt(id) },
        { $set: { status, updatedAt: new Date().toISOString() } }
      );

      return res.status(200).json({ success: true });
    }

    // DELETE - Delete booking (for admin)
    if (req.method === 'DELETE') {
      const { id } = req.query;

      await db.collection('bookings').deleteOne({ id: parseInt(id) });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error', details: error.message });
  }
}