const asyncHandler = require('express-async-handler');
const prisma = require('../config/db'); 
const cloudinary = require('../config/cloudinaryConfig');

const getCloudinaryPublicId = (imageUrl) => {
  if (!imageUrl) return null;
  const parts = imageUrl.split('/');
  const filenameWithExtension = parts[parts.length - 1];
  const publicId = filenameWithExtension.split('.')[0];
  return `car-rental-portal/${publicId}`; 
};


// @desc    Create a new car (Admin only)
// @route   POST /api/cars
// @access  Private/Admin
const createCar = asyncHandler(async (req, res) => {
  const {
    make,
    model,
    year,
    type,
    location,
    pricePerDay,
    availability,
    imageUrl: base64Image 
  } = req.body;

  if (!make || !model || !year || !type || !location || !pricePerDay) {
    res.status(400);
    throw new Error('Please enter all required fields.');
  }

  if (typeof year !== 'number' || year < 1900 || year > new Date().getFullYear() + 5) {
    res.status(400);
    throw new Error('Invalid year provided.');
  }
  if (typeof pricePerDay !== 'number' || pricePerDay <= 0) {
    res.status(400);
    throw new Error('Price per day must be a positive number.');
  }
  if (availability !== undefined && typeof availability !== 'boolean') {
    res.status(400);
    throw new Error('Availability must be a boolean (true/false).');
  }

  let imageUrl = null;
  if (base64Image) {
    try {
      const result = await cloudinary.uploader.upload(base64Image);
      imageUrl = result.secure_url;
    } catch (uploadError) {
      console.error('Cloudinary upload error during car creation:', uploadError);
      res.status(500);
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }
  }

  const car = await prisma.car.create({
    data: {
      make,
      model,
      year,
      type,
      location,
      pricePerDay,
      availability: availability !== undefined ? availability : true, 
      imageUrl,
    },
  });

  res.status(201).json(car);
});

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
const getCars = asyncHandler(async (req, res) => {
  const cars = await prisma.car.findMany();
  res.status(200).json(cars);
});

// @desc    Get single car by ID
// @route   GET /api/cars/:id
// @access  Public
const getCarById = asyncHandler(async (req, res) => {
  const car = await prisma.car.findUnique({
    where: { id: req.params.id },
  });

  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  res.status(200).json(car);
});

// @desc    Update car details (Admin only)
// @route   PUT /api/cars/:id
// @access  Private/Admin
const updateCar = asyncHandler(async (req, res) => {
  const carId = req.params.id;
  const {
    make,
    model,
    year,
    type,
    location,
    pricePerDay,
    availability,
    imageUrl: base64Image 
  } = req.body; 

  // 1. Find the car to update
  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) {
    res.status(404);
    throw new Error('Car not found.');
  }

  
  const dataToUpdate = {};

  if (req.body.hasOwnProperty('make')) {
    dataToUpdate.make = make;
  }
  if (req.body.hasOwnProperty('model')) {
    dataToUpdate.model = model;
  }
  if (req.body.hasOwnProperty('type')) {
    dataToUpdate.type = type;
  }
  if (req.body.hasOwnProperty('location')) {
    dataToUpdate.location = location;
  }

  // Handle 'year' with parsing and validation
  if (req.body.hasOwnProperty('year')) {
    const yearValue = parseInt(year);
    if (isNaN(yearValue) || yearValue < 1900 || yearValue > new Date().getFullYear() + 5) {
      res.status(400);
      throw new Error('Invalid year provided. Must be a number between 1900 and ' + (new Date().getFullYear() + 5) + '.');
    }
    dataToUpdate.year = yearValue;
  }

  // Handle 'pricePerDay' with parsing and validation
  if (req.body.hasOwnProperty('pricePerDay')) {
    const priceValue = parseFloat(pricePerDay);
    if (isNaN(priceValue) || priceValue <= 0) {
      res.status(400);
      throw new Error('Price per day must be a positive number.');
    }
    dataToUpdate.pricePerDay = priceValue;
  }

  // Handle 'availability' with boolean validation
  if (req.body.hasOwnProperty('availability')) {
    if (typeof availability !== 'boolean') {
      res.status(400);
      throw new Error('Availability must be a boolean (true or false).');
    }
    dataToUpdate.availability = availability;
  }

  if (base64Image) {
  
    try {
   
      console.log('Attempting to upload image to Cloudinary...');
      const result = await cloudinary.uploader.upload(base64Image);
      dataToUpdate.imageUrl = result.secure_url; 
   
    } catch (error) {
      console.error('Cloudinary image upload error during car update:', error);
      res.status(500);
      throw new Error(`Failed to upload new image to Cloudinary: ${error.message}`);
    }
  }

  else if (req.body.hasOwnProperty('imageUrl') && (req.body.imageUrl === null || req.body.imageUrl === '')) {
    dataToUpdate.imageUrl = null; 
    
  }

  if (Object.keys(dataToUpdate).length === 0) {
    res.status(400);
    throw new Error('No valid fields provided for update.');
  }

  const updatedCar = await prisma.car.update({
    where: { id: carId },
    data: dataToUpdate, 
  });

  res.status(200).json(updatedCar);
});

// @desc    Delete a car (Admin only)
// @route   DELETE /api/cars/:id
// @access  Private/Admin
const deleteCar = asyncHandler(async (req, res) => {
  const carId = req.params.id;

  const car = await prisma.car.findUnique({
    where: { id: carId },
  });

  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  
  /*
  if (car.imageUrl) {
    try {
      const publicIdToDelete = getCloudinaryPublicId(car.imageUrl);
      await cloudinary.uploader.destroy(publicIdToDelete);
      console.log(`Deleted Cloudinary image for car ${car.id}: ${publicIdToDelete}`);
    } catch (deleteError) {
      console.error('Cloudinary image deletion error during car deletion:', deleteError.message);
      // Decide if you want to throw an error here or just log it.
      // If the image deletion fails, should the car deletion still proceed?
      // For now, it will proceed.
    }
  }
  */

  await prisma.car.delete({
    where: { id: carId },
  });

  res.status(200).json({ message: 'Car removed successfully' });
});

module.exports = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar
};