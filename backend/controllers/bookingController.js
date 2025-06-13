const asyncHandler = require('express-async-handler');
const prisma = require('../config/db');
const moment = require('moment'); 

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private/Customer
const createBooking = asyncHandler(async (req, res) => {
  const { carId, startDate, endDate } = req.body;
  const userId = req.user.id; 

  if (!carId || !startDate || !endDate) {
    res.status(400);
    throw new Error('Please provide car ID, start date, and end date for the booking.');
  }

  const car = await prisma.car.findUnique({ where: { id: carId } });

  if (!car) {
    res.status(404);
    throw new Error('Car not found.');
  }

  if (!car.availability) {
    res.status(400);
    throw new Error('Car is currently not available for booking.');
  }

  const start = moment(startDate);
  const end = moment(endDate);

  // Basic date validations
  if (!start.isValid() || !end.isValid()) {
    res.status(400);
    throw new Error('Invalid date format provided.');
  }
  if (start.isBefore(moment(), 'day')) {
    res.status(400);
    throw new Error('Start date cannot be in the past.');
  }
  if (start.isSameOrAfter(end, 'day')) {
    res.status(400);
    throw new Error('End date must be after the start date.');
  }

  const durationInDays = end.diff(start, 'days');
  if (durationInDays <= 0) {
    res.status(400);
    throw new Error('Booking duration must be at least one day.');
  }

  const totalPrice = durationInDays * car.pricePerDay;

  const existingOverlappingBookings = await prisma.booking.findMany({
    where: {
      carId,
      status: { not: 'cancelled' }, 
      OR: [
        // New booking starts during an existing one
        {
          startDate: { lte: end.toDate() },
          endDate: { gte: start.toDate() },
        },
      ],
    },
  });

  if (existingOverlappingBookings.length > 0) {
    res.status(400);
    throw new Error('Car is already booked for some part of the selected dates.');
  }

  const booking = await prisma.booking.create({
    data: {
      userId,
      carId,
      startDate: start.toDate(), 
      endDate: end.toDate(),    
      totalPrice,
      status: 'pending', 
    },
  });

  // await prisma.car.update({
  //   where: { id: carId },
  //   data: { availability: false },
  // });

  res.status(201).json(booking);
});

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await prisma.booking.findMany({
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      car: {
        select: { id: true, make: true, model: true, year: true, pricePerDay: true, imageUrl: true },
      },
    },
    orderBy: {
      createdAt: 'desc', 
    },
  });
  res.status(200).json(bookings);
});

// @desc    Get bookings for a specific user (customer)
// @route   GET /api/bookings/my
// @access  Private/Customer
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user.id }, // Filter by logged-in user's ID
    include: {
      car: {
        select: { id: true, make: true, model: true, year: true, pricePerDay: true, imageUrl: true },
      },
    },
    orderBy: {
      createdAt: 'desc', 
    },
  });
  res.status(200).json(bookings);
});

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Private (Admin or Customer if their booking)
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      car: {
        select: { id: true, make: true, model: true, year: true, pricePerDay: true, imageUrl: true },
      },
    },
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found.');
  }

  if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
    res.status(403); // Forbidden
    throw new Error('Not authorized to view this booking.');
  }

  res.status(200).json(booking);
});

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status provided. Allowed: pending, confirmed, cancelled, completed.');
  }

  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id },
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found.');
  }

  const oldStatus = booking.status;

  const updatedBooking = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status },
  });

  if (status === 'cancelled' && oldStatus !== 'cancelled') {

    await prisma.car.update({
      where: { id: booking.carId },
      data: { availability: true },
    });
  } else if (status === 'confirmed' && oldStatus !== 'confirmed') {

    await prisma.car.update({
      where: { id: booking.carId },
      data: { availability: false },
    });
  }

  else if (status === 'completed' && oldStatus !== 'completed') {
    await prisma.car.update({
      where: { id: booking.carId },
      data: { availability: true },
    });
  }

  res.status(200).json(updatedBooking);
});

// @desc    Generate invoice (PDF generation is complex, this is a placeholder)
// @route   GET /api/bookings/:id/invoice
// @access  Private (Admin or Customer if their booking)
const generateInvoice = asyncHandler(async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      car: {
        select: { id: true, make: true, model: true, year: true, pricePerDay: true, imageUrl: true },
      },
    },
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found.');
  }

  if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
    res.status(403); // Forbidden
    throw new Error('Not authorized to generate invoice for this booking.');
  }

 
  res.status(200).json({
    message: 'Invoice data retrieved successfully (PDF generation is a separate step).',
    invoiceDetails: {
      bookingId: booking.id,
      customerName: `${booking.user.firstName} ${booking.user.lastName}`,
      customerEmail: booking.user.email,
      carDetails: `${booking.car.year} ${booking.car.make} ${booking.car.model}`,
      carImageUrl: booking.car.imageUrl,
      startDate: booking.startDate,
      endDate: booking.endDate,
      durationDays: moment(booking.endDate).diff(moment(booking.startDate), 'days'),
      pricePerDay: booking.car.pricePerDay,
      totalPrice: booking.totalPrice,
      status: booking.status,
      bookingDate: booking.createdAt,
      invoiceGeneratedDate: new Date(),
    },
  });
});

module.exports = {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  generateInvoice,
};