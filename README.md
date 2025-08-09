# School Management API

A comprehensive Node.js API system for managing school data with proximity-based sorting using Express.js and PostgreSQL (Neon DB).

## Features

- **Add School API**: Add new schools with validation
- **List Schools API**: Retrieve schools sorted by proximity to user location
- **Distance Calculation**: Uses Haversine formula for accurate geographical distance
- **Input Validation**: Comprehensive validation using Joi
- **Database**: PostgreSQL with Neon DB hosting
- **Security**: Helmet.js for security headers
- **CORS**: Cross-Origin Resource Sharing enabled

## API Endpoints

### 1. Add School
- **Endpoint**: `POST /addSchool`
- **Description**: Add a new school to the database
- **Request Body**:
```json
{
  "name": "School Name",
  "address": "School Address",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```
- **Response**:
```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "School Name",
    "address": "School Address",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 2. List Schools
- **Endpoint**: `GET /listSchools`
- **Description**: Get all schools sorted by proximity to user location
- **Query Parameters**:
  - `latitude`: User's latitude (-90 to 90)
  - `longitude`: User's longitude (-180 to 180)
- **Example**: `GET /listSchools?latitude=40.7589&longitude=-73.9851`
- **Response**:
```json
{
  "success": true,
  "message": "Schools retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "School Name",
      "address": "School Address",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "distance": 2.45,
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "userLocation": {
    "latitude": 40.7589,
    "longitude": -73.9851
  },
  "totalSchools": 1
}
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database (Neon DB recommended)

### Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Environment Configuration**:
   - Copy `.env.example` to `.env`
   - Update the `DATABASE_URL` with your Neon DB connection string
   - Set other environment variables as needed

3. **Database Setup**:
   - The application will automatically create the `schools` table on startup
   - No manual database setup required

4. **Start the server**:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
PORT=3000
NODE_ENV=development
```

## Database Schema

### Schools Table
```sql
CREATE TABLE schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  latitude FLOAT NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
  longitude FLOAT NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Validation Rules

### Add School
- **name**: Required, 1-255 characters
- **address**: Required, 1-500 characters
- **latitude**: Required, number between -90 and 90
- **longitude**: Required, number between -180 and 180

### List Schools
- **latitude**: Required, number between -90 and 90
- **longitude**: Required, number between -180 and 180

## Distance Calculation

The API uses the Haversine formula to calculate the great-circle distance between two points on Earth, providing accurate geographical distances in kilometers.

## Error Handling

The API provides comprehensive error handling with appropriate HTTP status codes:

- `200`: Success
- `201`: Created (new school added)
- `400`: Bad Request (validation errors)
- `404`: Not Found (invalid endpoint)
- `409`: Conflict (duplicate school)
- `500`: Internal Server Error

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Joi schema validation
- **SQL Injection Protection**: Parameterized queries
- **Environment Variables**: Sensitive data protection

## Testing

Use the provided Postman collection for testing the APIs. The collection includes:
- Sample requests for both endpoints
- Environment variables for easy testing
- Expected response examples

## Deployment

The application is ready for deployment on platforms like:
- Heroku
- Railway
- Render
- Vercel
- AWS
- Google Cloud Platform

Make sure to set the appropriate environment variables in your hosting platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
