import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(req) {
  try {
    // Parse the request body
    const { id } = await req.json();

    // Validate input
    if (!id) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
    }

    // Connect to the database
    const client = await clientPromise;
    const db = client.db('weather-app');

    // Delete the document with the given ID
    const result = await db.collection('weather').deleteOne({ _id: new ObjectId(id) });

    // Return a success response
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    // Handle errors
    return new Response(JSON.stringify({ error: 'Failed to delete record' }), { status: 500 });
  }
}