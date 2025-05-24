import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  try {
    // Connect to the database
    const client = await clientPromise;
    const db = client.db('weather-app');

    // Fetch all documents from the "weather" collection
    const weatherData = await db.collection('weather').find({}).toArray();

    // Return the data as a JSON response
    return new Response(JSON.stringify(weatherData), { status: 200 });
  } catch (error) {
    // Handle errors
    return new Response(JSON.stringify({ error: 'Failed to fetch records' }), { status: 500 });
  }
}