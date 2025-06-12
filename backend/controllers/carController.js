// controllers/carController.js
const asyncHandler = require('express-async-handler');
const prisma = require('../config/db');
const cloudinary = require('../config/cloudinaryConfig'); // Import Cloudinary config

// Helper function to extract public ID from Cloudinary URL
const getCloudinaryPublicId = (imageUrl) => {
  const parts = imageUrl.split('/');
  const filenameWithExtension = parts[parts.length - 1];
  const publicId = filenameWithExtension.split('.')[0];
  // If you used a folder (e.g., 'car-rental-portal/'), the public_id for destroy needs to include it.
  // Assuming the upload uses 'folder: 'car-rental-portal''
  return `car-rental-portal/${publicId}`;
};

// @desc    Add a new car (Admin only)
// @route   POST /api/cars
// @access  Private/Admin
const addCar = asyncHandler(async (req, res) => {
  const { make, model, year, type, location, pricePerDay, imageUrl: base64Image } = req.body; // imageUrl now holds base64 string

  if (!make || !model || !year || !type || !location || !pricePerDay) {
    res.status(400);
    throw new Error('Please provide all required car details: make, model, year, type, location, price per day.');
  }
  if (typeof year !== 'number' || year < 1900 || year > new Date().getFullYear() + 5) {
    res.status(400);
    throw new Error('Invalid year provided.');
  }
  if (typeof pricePerDay !== 'number' || pricePerDay <= 0) {
    res.status(400);
    throw new Error('Price per day must be a positive number.');
  }

  let cloudinaryImageUrl = null;
  if (base64Image) {
    try {
      // Upload Base64 image to Cloudinary
      // 'data:image/jpeg;base64,...' is automatically handled by Cloudinary
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: 'car-rental-portal', // Store images in a specific folder
        resource_type: 'image', // Ensure it's treated as an image
      });
      cloudinaryImageUrl = result.secure_url; // Get the secure URL of the uploaded image
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError.message);
      res.status(500);
      throw new Error('Image upload failed. Please try again.');
    }
  }

  const car = await prisma.car.create({
    data: {
      make,
      model,
      year: parseInt(year), // Ensure year is integer
      type,
      location,
      pricePerDay: parseFloat(pricePerDay), // Ensure pricePerDay is float
      imageUrl: cloudinaryImageUrl, // Store the Cloudinary URL
    },
  });

  res.status(201).json(car);
});

// @desc    Get all cars (with filters for customers)
// @route   GET /api/cars
// @access  Public
const getCars = asyncHandler(async (req, res) => {
  const { type, location, minPrice, maxPrice, availability } = req.query;

  let where = {};
  if (type) {
    where.type = { equals: type, mode: 'insensitive' }; // Case-insensitive type filter
  }
  if (location) {
    where.location = { equals: location, mode: 'insensitive' }; // Case-insensitive location filter
  }
  if (minPrice || maxPrice) {
    where.pricePerDay = {};
    if (minPrice) {
      where.pricePerDay.gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      where.pricePerDay.lte = parseFloat(maxPrice);
    }
  }
  if (availability) {
    where.availability = availability === 'true'; // Filter by boolean availability
  }

  const cars = await prisma.car.findMany({
    where,
    orderBy: {
      createdAt: 'desc', // Order by creation date, newest first
    },
  });

  res.status(200).json(cars);
});

// @desc    Get car by ID
// @route   GET /api/cars/:id
// @access  Public
const getCarById = asyncHandler(async (req, res) => {
  const car = await prisma.car.findUnique({
    where: { id: req.params.id },
  });

  if (car) {
    res.status(200).json(car);
  } else {
    res.status(404);
    throw new Error('Car not found');
  }
});

// @desc    Update car details (Admin only)
// @route   PUT /api/cars/:id
// @access  Private/Admin
const updateCar = asyncHandler(async (req, res) => {
  const { make, model, year, type, location, pricePerDay, availability, imageUrl: base64Image } = req.body;

  const car = await prisma.car.findUnique({
    where: { id: req.params.id },
  });

  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  // Validate incoming numeric data
  if (year && (typeof year !== 'number' || year < 1900 || year > new Date().getFullYear() + 5)) {
    res.status(400);
    throw new Error('Invalid year provided for update.');
  }
  if (pricePerDay && (typeof pricePerDay !== 'number' || pricePerDay <= 0)) {
    res.status(400);
    throw new Error('Price per day must be a positive number for update.');
  }

  let newCloudinaryImageUrl = car.imageUrl; // Default to existing URL
  if (base64Image) { // If a new Base64 image string is provided
    try {
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: 'car-rental-portal',
        resource_type: 'image',
      });
      newCloudinaryImageUrl = result.secure_url;

      // Optional: Delete old image from Cloudinary if it exists
      if (car.imageUrl) {
        const publicIdToDelete = getCloudinaryPublicId(car.imageUrl);
        await cloudinary.uploader.destroy(publicIdToDelete);
      }
    } catch (uploadError) {
      console.error('Cloudinary update image upload error:', uploadError.message);
      res.status(500);
      throw new Error('Image update failed. Please try again.');
    }
  } else if (req.body.hasOwnProperty('imageUrl') && (req.body.imageUrl === null || req.body.imageUrl === '')) {
      // If imageUrl is explicitly sent as null or empty string, it means remove the image
      if (car.imageUrl) {
        try {
          const publicIdToDelete = getCloudinaryPublicId(car.imageUrl);
          await cloudinary.uploader.destroy(publicIdToDelete);
        } catch (deleteError) {
          console.error('Cloudinary image deletion error during update:', deleteError.message);
        }
      }
      newCloudinaryImageUrl = null;
  }
  // If base64Image is not provided and imageUrl is not explicitly null/empty,
  // it means the imageUrl was not sent in the request, so we keep the existing one.


  const updatedCar = await prisma.car.update({
    where: { id: req.params.id },
    data: {
      make: make !== undefined ? make : car.make,
      model: model !== undefined ? model : car.model,
      year: year !== undefined ? parseInt(year) : car.year,
      type: type !== undefined ? type : car.type,
      location: location !== undefined ? location : car.location,
      pricePerDay: pricePerDay !== undefined ? parseFloat(pricePerDay) : car.pricePerDay,
      // Ensure availability is a boolean, handling undefined correctly
      availability: typeof availability === 'boolean' ? availability : car.availability,
      imageUrl: newCloudinaryImageUrl, // Use the new Cloudinary URL or existing/null
    },
  });

  res.status(200).json(updatedCar);
});

// @desc    Delete a car (Admin only)
// @route   DELETE /api/cars/:id
// @access  Private/Admin
const deleteCar = asyncHandler(async (req, res) => {
  const car = await prisma.car.findUnique({
    where: { id: req.params.id },
  });

  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  // Optional: Delete image from Cloudinary when deleting car
  if (car.imageUrl) {
    try {
      const publicIdToDelete = getCloudinaryPublicId(car.imageUrl);
      await cloudinary.uploader.destroy(publicIdToDelete);
    } catch (deleteError) {
      console.error('Cloudinary image deletion error:', deleteError.message);
      // Log the error but don't prevent car deletion from DB,
      // as DB integrity is more critical.
    }
  }

  await prisma.car.delete({
    where: { id: req.params.id },
  });

  res.status(200).json({ message: 'Car removed successfully' });
});

module.exports = {
  addCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
};