const { pool } = require('../config/database');
const { validateAddSchool, validateListSchools } = require('../utils/validation');
const { sortSchoolsByDistance } = require('../utils/distance');

// Add a new school
const addSchool = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = validateAddSchool(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    
    const { name, address, latitude, longitude } = value;
    
    // Check if school with same name and address already exists
    const checkQuery = `
      SELECT id FROM schools 
      WHERE LOWER(name) = LOWER($1) AND LOWER(address) = LOWER($2)
    `;
    
    const existingSchool = await pool.query(checkQuery, [name, address]);
    
    if (existingSchool.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'A school with the same name and address already exists'
      });
    }
    
    // Insert new school
    const insertQuery = `
      INSERT INTO schools (name, address, latitude, longitude)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, address, latitude, longitude, created_at
    `;
    
    const result = await pool.query(insertQuery, [name, address, latitude, longitude]);
    const newSchool = result.rows[0];
    
    res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: {
        id: newSchool.id,
        name: newSchool.name,
        address: newSchool.address,
        latitude: newSchool.latitude,
        longitude: newSchool.longitude,
        createdAt: newSchool.created_at
      }
    });
    
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// List schools sorted by proximity to user location
const listSchools = async (req, res) => {
  try {
    // Validate query parameters
    const { error, value } = validateListSchools({
      latitude: parseFloat(req.query.latitude),
      longitude: parseFloat(req.query.longitude)
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    
    const { latitude: userLat, longitude: userLon } = value;
    
    // Fetch all schools from database
    const query = `
      SELECT id, name, address, latitude, longitude, created_at
      FROM schools
      ORDER BY id
    `;
    
    const result = await pool.query(query);
    const schools = result.rows;
    
    if (schools.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No schools found',
        data: [],
        userLocation: {
          latitude: userLat,
          longitude: userLon
        }
      });
    }
    
    // Sort schools by distance from user location
    const sortedSchools = sortSchoolsByDistance(schools, userLat, userLon);
    
    // Format response data
    const formattedSchools = sortedSchools.map(school => ({
      id: school.id,
      name: school.name,
      address: school.address,
      latitude: school.latitude,
      longitude: school.longitude,
      distance: Math.round(school.distance * 100) / 100, // Round to 2 decimal places
      createdAt: school.created_at
    }));
    
    res.status(200).json({
      success: true,
      message: 'Schools retrieved successfully',
      data: formattedSchools,
      userLocation: {
        latitude: userLat,
        longitude: userLon
      },
      totalSchools: formattedSchools.length
    });
    
  } catch (error) {
    console.error('Error listing schools:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  addSchool,
  listSchools
};
