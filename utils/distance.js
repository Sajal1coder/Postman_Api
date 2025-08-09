// Haversine formula to calculate distance between two points on Earth
// Returns distance in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  
  // Convert degrees to radians
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const rLat1 = toRadians(lat1);
  const rLat2 = toRadians(lat2);
  
  // Haversine formula
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rLat1) * Math.cos(rLat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in kilometers
};

// Convert degrees to radians
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

// Sort schools by distance from user location
const sortSchoolsByDistance = (schools, userLat, userLon) => {
  return schools.map(school => ({
    ...school,
    distance: calculateDistance(userLat, userLon, school.latitude, school.longitude)
  })).sort((a, b) => a.distance - b.distance);
};

module.exports = {
  calculateDistance,
  sortSchoolsByDistance
};
