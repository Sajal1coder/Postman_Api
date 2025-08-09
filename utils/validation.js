const Joi = require('joi');

// Validation schema for adding a new school
const addSchoolSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.empty': 'School name is required',
      'string.min': 'School name cannot be empty',
      'string.max': 'School name cannot exceed 255 characters'
    }),
  
  address: Joi.string()
    .trim()
    .min(1)
    .max(500)
    .required()
    .messages({
      'string.empty': 'Address is required',
      'string.min': 'Address cannot be empty',
      'string.max': 'Address cannot exceed 500 characters'
    }),
  
  latitude: Joi.number()
    .min(-90)
    .max(90)
    .required()
    .messages({
      'number.base': 'Latitude must be a number',
      'number.min': 'Latitude must be between -90 and 90',
      'number.max': 'Latitude must be between -90 and 90',
      'any.required': 'Latitude is required'
    }),
  
  longitude: Joi.number()
    .min(-180)
    .max(180)
    .required()
    .messages({
      'number.base': 'Longitude must be a number',
      'number.min': 'Longitude must be between -180 and 180',
      'number.max': 'Longitude must be between -180 and 180',
      'any.required': 'Longitude is required'
    })
});

// Validation schema for listing schools (user location)
const listSchoolsSchema = Joi.object({
  latitude: Joi.number()
    .min(-90)
    .max(90)
    .required()
    .messages({
      'number.base': 'User latitude must be a number',
      'number.min': 'User latitude must be between -90 and 90',
      'number.max': 'User latitude must be between -90 and 90',
      'any.required': 'User latitude is required'
    }),
  
  longitude: Joi.number()
    .min(-180)
    .max(180)
    .required()
    .messages({
      'number.base': 'User longitude must be a number',
      'number.min': 'User longitude must be between -180 and 180',
      'number.max': 'User longitude must be between -180 and 180',
      'any.required': 'User longitude is required'
    })
});

// Validate add school request
const validateAddSchool = (data) => {
  return addSchoolSchema.validate(data, { abortEarly: false });
};

// Validate list schools request
const validateListSchools = (data) => {
  return listSchoolsSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateAddSchool,
  validateListSchools
};
