# weather app

**Weather Explorer** is a web application that allows users to explore weather information, YouTube videos, and Wikipedia summaries for a given location. Users can also export the data in multiple formats (JSON, XML, CSV, Markdown).

---

## Features

1. **Weather Information**:
   - Displays weather details for a given location.
   - Fetches data using the OpenWeatherMap API.

2. **YouTube Videos**:
   - Displays YouTube videos related to the location.
   - Fetches data using the YouTube Data API.

3. **Wikipedia Summary**:
   - Displays a brief summary of the location from Wikipedia.
   - Fetches data using the Wikipedia REST API.

4. **Export Data**:
   - Allows users to export data in JSON, XML, CSV, and Markdown formats.

5. **Google Maps Integration**:
   - Displays the location on a Google Map.

---

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Backend**: Next.js (App Router)
- **APIs**:
  - OpenWeatherMap API
  - YouTube Data API
  - Wikipedia REST API
  - Google Maps Embed API

---

## How to Run the Project

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```
### 2. Install Dependencies

Make sure you have pnpm installed. Then run:

```bash
pnpm install
```
### 3. Set Up Environment Variables

Create a .env.local file in the root directory and add the following variables:

```bash
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/weather_app
NEXT_PUBLIC_OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```
### 4. Run Database Migrations

Use a migration tool (e.g., Prisma or Sequelize) to set up the database schema:

```bash
npx prisma migrate dev
```
### 5. Start the Development Server

Run the following command:

```bash
pnpm dev
```
The app will be available at ```http://localhost:3000.```

## CRUD Operations
The app supports full CRUD (Create, Read, Update, Delete) operations for managing weather data in the database.

### 1. CREATE - Add Weather Data

Endpoint: POST /api/weather
Description: Adds weather data for a location and date range.
Request Body

```bash
{
  "location": "New York",
  "start_date": "2023-01-01",
  "end_date": "2023-01-07"
}
```
Example Command:
```bash
curl -X POST http://localhost:3000/api/weather \
-H "Content-Type: application/json" \
-d '{
  "location": "New York",
  "start_date": "2023-01-01",
  "end_date": "2023-01-07"
}'
```

### 2. READ - Retrieve Weather Data

Endpoint: GET /api/weather
Description: Retrieves weather data from the database.
Query Parameters:
location (optional): Filter by location.
start_date and end_date (optional): Filter by date range.
Example Command:
```bash
curl -X GET "http://localhost:3000/api/weather?location=New%20York&start_date=2023-01-01&end_date=2023-01-07"
```

### 3. UPDATE - Modify Weather Data
Endpoint: PUT /api/weather/:id
Description: Updates weather data for a specific record.
Request Body:
```bash
{
  "location": "Los Angeles",
  "start_date": "2023-01-01",
  "end_date": "2023-01-07"
}
```

Example Command:
```bash
curl -X PUT http://localhost:3000/api/weather/1 \
-H "Content-Type: application/json" \
-d '{
  "location": "Los Angeles",
  "start_date": "2023-01-01",
  "end_date": "2023-01-07"
}'
```

### 4. DELETE - Remove Weather Data
Endpoint: DELETE /api/weather/:id
Description: Deletes a specific weather record.
Example Command:
```bash
curl -X DELETE http://localhost:3000/api/weather/1
```
## API Endpoints Summary
```bash
Method	Endpoint	Description
POST	/api/weather	Create a new weather record
GET	/api/weather	Retrieve weather records
PUT	/api/weather/:id	Update an existing weather record
DELETE	/api/weather/:id	Delete a weather record
```

## Notes
Ensure the database is running before starting the server.
Validate location and date ranges before making API requests.