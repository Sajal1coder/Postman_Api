const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { initializeDatabase } = require('./config/database');
const schoolRoutes = require('./routes/schoolRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'School Management API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/', schoolRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to School Management API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      addSchool: 'POST /addSchool',
      listSchools: 'GET /listSchools?latitude={lat}&longitude={lon}'
    },
    documentation: {
      addSchool: {
        method: 'POST',
        endpoint: '/addSchool',
        body: {
          name: 'string (required)',
          address: 'string (required)',
          latitude: 'number (required, -90 to 90)',
          longitude: 'number (required, -180 to 180)'
        }
      },
      listSchools: {
        method: 'GET',
        endpoint: '/listSchools',
        parameters: {
          latitude: 'number (required, -90 to 90)',
          longitude: 'number (required, -180 to 180)'
        }
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /addSchool',
      'GET /listSchools'
    ]
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database schema
    await initializeDatabase();
    console.log('Database initialized successfully');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`School Management API server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API Documentation: http://localhost:${PORT}/`);
      console.log(`Add School: POST http://localhost:${PORT}/addSchool`);
      console.log(`List Schools: GET http://localhost:${PORT}/listSchools?latitude={lat}&longitude={lon}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Graceful shutdown...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM. Graceful shutdown...');
  process.exit(0);
});

// Start the server
startServer();
