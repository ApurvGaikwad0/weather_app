import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(req) {
  try {
    // Parse the request body
    const { id, updatedData } = await req.json();

    // Validate input
    if (!id || !updatedData) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
    }

    // Connect to the database
    const client = await clientPromise;
    const db = client.db('weather-app');

    // Update the document with the given ID
    const result = await db.collection('weather').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    // Return a success response
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    // Handle errors
    return new Response(JSON.stringify({ error: 'Failed to update record' }), { status: 500 });
  }
}