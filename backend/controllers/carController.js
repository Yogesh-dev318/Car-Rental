// backend/controllers/carController.js
const asyncHandler = require('express-async-handler');
const prisma = require('../config/db'); // Assuming this correctly imports your Prisma client
const cloudinary = require('../config/cloudinaryConfig');

// Helper function to extract public ID from Cloudinary URL (kept for context, though not used for deletion now)
// IMPORTANT: If you remove the 'folder' option during upload, the publicId might not contain a folder prefix
// in the URL. If you re-introduce deletion functionality later, you might need to adjust this helper
// or how you derive the publicId from the stored URL.
const getCloudinaryPublicId = (imageUrl) => {
  if (!imageUrl) return null;
  const parts = imageUrl.split('/');
  const filenameWithExtension = parts[parts.length - 1];
  const publicId = filenameWithExtension.split('.')[0];
  // This assumes 'car-rental-portal' was part of the public ID.
  // If you upload to root now, the publicId will just be the filename.
  // Example: 'image_name' instead of 'folder/image_name'.
  // If you were to delete, you'd need to correctly derive the publicId (e.g., "image_name").
  return `car-rental-portal/${publicId}`; // This line would likely need review if deletion is re-enabled
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
    imageUrl: base64Image // This is the Base64 string for the image
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
  // Availability is optional for creation, defaults to true if not provided.
  // If provided, it must be boolean.
  if (availability !== undefined && typeof availability !== 'boolean') {
    res.status(400);
    throw new Error('Availability must be a boolean (true/false).');
  }

  let imageUrl = null;
  if (base64Image) {
    try {
      // SIMPLIFIED CLOUDINARY UPLOAD CALL HERE:
      const result = await cloudinary.uploader.upload(base64Image);
      imageUrl = result.secure_url;
    } catch (uploadError) {
      console.error('Cloudinary upload error during car creation:', uploadError.message);
      res.status(500);
      throw new Error('Image upload failed. Please try again.');
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
      availability: availability !== undefined ? availability : true, // Default to true if not provided
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
    imageUrl: base64Image // This specifically captures the base64 string for a new image
  } = req.body; // Destructure all possible fields directly from req.body

  // 1. Find the car to update
  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) {
    res.status(404);
    throw new Error('Car not found.');
  }

  // --- START: Image Update Logic (takes precedence) ---
  // If `base64Image` is provided, it means a new image is being uploaded.
  if (base64Image) {
    try {
      // SIMPLIFIED CLOUDINARY UPLOAD CALL HERE:
      const result = await cloudinary.uploader.upload(base64Image);
      // Only update the imageUrl in the database
      const updatedCar = await prisma.car.update({
        where: { id: carId },
        data: { imageUrl: result.secure_url },
      });
      res.status(200).json(updatedCar);
      return; // IMPORTANT: Exit the function after handling image update
    } catch (uploadError) {
      console.error('Cloudinary image upload error during car update:', uploadError.message);
      res.status(500);
      throw new Error('Failed to upload new image to Cloudinary.');
    }
  }
  // If `req.body` explicitly contains `imageUrl` and its value is `null` or an empty string,
  // it means the client wants to remove the image.
  else if (req.body.hasOwnProperty('imageUrl') && (req.body.imageUrl === null || req.body.imageUrl === '')) {
    // Only update the imageUrl to null in the database
    const updatedCar = await prisma.car.update({
      where: { id: carId },
      data: { imageUrl: null },
    });
    res.status(200).json(updatedCar);
    return; // IMPORTANT: Exit the function after handling image update
  }
  // --- END: Image Update Logic ---

  // --- START: Other Car Details Update Logic (only if no image update was requested) ---
  const dataToUpdate = {}; // Initialize data for non-image fields

  // Process each potential updatable field from req.body
  // We use `req.body.hasOwnProperty()` to ensure we update even if the value is `null`, `false`, or `0`.
  // If a field is not present in req.body, it's simply skipped, and Prisma keeps the existing value.

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

  // Check if there's anything valid to update (non-image fields)
  if (Object.keys(dataToUpdate).length === 0) {
    res.status(400);
    throw new Error('No valid fields provided for update. To update an image, include `imageUrl` as base64 or null/empty string.');
  }

  // Perform the database update for non-image fields
  const updatedCar = await prisma.car.update({
    where: { id: carId },
    data: dataToUpdate, // Prisma will only update the fields explicitly in `dataToUpdate`
  });

  res.status(200).json(updatedCar);
  // --- END: Other Car Details Update Logic ---
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

  // Optional: If you ever want to delete the image from Cloudinary when the car is deleted,
  // you would re-enable this section. Currently, images are NOT deleted from Cloudinary.
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

// Export all controller functions
module.exports = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
};