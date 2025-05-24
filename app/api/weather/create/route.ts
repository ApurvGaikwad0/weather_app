import clientPromise from '../../../../lib/mongodb';

export async function POST(req) {
  try {
    // Parse the request body
    const { location, dateRange, weatherData } = await req.json();

    // Validate input
    if (!location || !dateRange || !dateRange.start || !dateRange.end || !weatherData) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
    }

    // Connect to the database
    const client = await clientPromise;
    const db = client.db('weather-app');

    // Insert the data into the database
    const result = await db.collection('weather').insertOne({
      location,
      dateRange,
      weatherData,
      createdAt: new Date(),
    });

    // Return a success response
    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    // Handle errors
    return new Response(JSON.stringify({ error: 'Failed to create record' }), { status: 500 });
  }
}