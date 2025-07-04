const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  try {
    console.log('Deleting existing bookings...');
    await prisma.booking.deleteMany();
    console.log('Deleting existing cars...');
    await prisma.car.deleteMany();
    console.log('Deleting existing users...');
    await prisma.user.deleteMany();
    console.log('Existing data cleared.');
  } catch (error) {
    console.error('Error clearing data:', error);

  }


  const hashedPasswordAdmin = await bcrypt.hash('123456789', 10);
  const hashedPasswordCustomer = await bcrypt.hash('123456789', 10);

  const adminUser = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: hashedPasswordAdmin,
      role: 'admin',
    },
  });
  console.log(`Created admin user: ${adminUser.email}`);

  const customer1 = await prisma.user.create({
    data: {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      password: hashedPasswordCustomer,
      role: 'customer',
    },
  });
  console.log(`Created customer: ${customer1.email}`);

  const customer2 = await prisma.user.create({
    data: {
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
      password: hashedPasswordCustomer,
      role: 'customer',
    },
  });
  console.log(`Created customer: ${customer2.email}`);


  const car1 = await prisma.car.create({
    data: {
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      type: 'Sedan',
      location: 'New Delhi',
      pricePerDay: 75.00,
      availability: true,
      imageUrl: 'https://res.cloudinary.com/dkegbcjgg/image/upload/v1749820070/xmsr0sssrrernokkwuxu.jpg', 
    },
  });
  console.log(`Created car: ${car1.make} ${car1.model}`);

  const car2 = await prisma.car.create({
    data: {
      make: 'Honda',
      model: 'CRV',
      year: 2023,
      type: 'SUV',
      location: 'Mumbai',
      pricePerDay: 120.00,
      availability: true,
      imageUrl: 'https://res.cloudinary.com/dkegbcjgg/image/upload/v1749820043/txnef9j2m5dcg5nthnnw.jpg', 
    },
  });
  console.log(`Created car: ${car2.make} ${car2.model}`);

  const car3 = await prisma.car.create({
    data: {
      make: 'Mercedes-Benz',
      model: 'C-Class',
      year: 2021,
      type: 'Luxury',
      location: 'Bengaluru',
      pricePerDay: 200.00,
      availability: true,
      imageUrl: 'https://res.cloudinary.com/dkegbcjgg/image/upload/v1749820032/wauas1hfdmqgz3q1jylj.webp', 
    },
  });
  console.log(`Created car: ${car3.make} ${car3.model}`);

  const car4 = await prisma.car.create({
    data: {
      make: 'Hyundai',
      model: 'Creta',
      year: 2024,
      type: 'SUV',
      location: 'New Delhi',
      pricePerDay: 90.00,
      availability: true,
      imageUrl: 'https://res.cloudinary.com/dkegbcjgg/image/upload/v1749820084/gguz4z3ste0xpgqygiaq.jpg', 
    },
  });
  console.log(`Created car: ${car4.make} ${car4.model}`);


  const booking1 = await prisma.booking.create({
    data: {
      userId: customer1.id,
      carId: car1.id,
      startDate: new Date('2025-07-01T10:00:00Z'),
      endDate: new Date('2025-07-05T10:00:00Z'),
      totalPrice: 4 * car1.pricePerDay, 
      status: 'confirmed',
    },
  });
  console.log(`Created booking: ${booking1.id} for ${customer1.email}`);

  // Booking for car2 by customer2 (pending)
  const booking2 = await prisma.booking.create({
    data: {
      userId: customer2.id,
      carId: car2.id,
      startDate: new Date('2025-07-10T10:00:00Z'),
      endDate: new Date('2025-07-12T10:00:00Z'),
      totalPrice: 2 * car2.pricePerDay, 
      status: 'pending',
    },
  });
  console.log(`Created booking: ${booking2.id} for ${customer2.email}`);

  const booking3 = await prisma.booking.create({
    data: {
      userId: customer1.id,
      carId: car4.id,
      startDate: new Date('2025-05-15T10:00:00Z'),
      endDate: new Date('2025-05-18T10:00:00Z'),
      totalPrice: 3 * car4.pricePerDay, 
      status: 'completed',
    },
  });
  console.log(`Created booking: ${booking3.id} for ${customer1.email}`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });