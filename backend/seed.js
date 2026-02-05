require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Pharmacy = require('./models/Pharmacy');
const Medicine = require('./models/Medicine');
const Inventory = require('./models/Inventory');

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medipickup');
    console.log('✓ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep data)
    // await User.deleteMany({});
    // await Pharmacy.deleteMany({});
    // await Medicine.deleteMany({});
    // await Inventory.deleteMany({});
    // console.log('✓ Cleared existing data');

    // Create admin user
    let admin = await User.findOne({ email: 'admin@demo.com' });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('password', 10);
      admin = await User.create({
        name: 'Demo Pharmacy Admin',
        email: 'admin@demo.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+1234567890',
      });
      console.log('✓ Created admin user');
    } else {
      console.log('✓ Admin user already exists');
    }

    // Create pharmacies in Hyderabad
    const pharmacyData = [
      {
        name: 'MediCare Pharmacy',
        address: 'Banjara Hills, Road No 12, Hyderabad',
        latitude: 17.4239,
        longitude: 78.4738,
        owner: admin._id,
      },
      {
        name: 'HealthPlus Pharmacy',
        address: 'Jubilee Hills, Hyderabad',
        latitude: 17.4326,
        longitude: 78.4071,
        owner: admin._id,
      },
      {
        name: 'QuickMed Pharmacy',
        address: 'Madhapur, HITEC City, Hyderabad',
        latitude: 17.4485,
        longitude: 78.3908,
        owner: admin._id,
      },
      {
        name: 'Apollo Pharmacy',
        address: 'Gachibowli, Hyderabad',
        latitude: 17.4400,
        longitude: 78.3489,
        owner: admin._id,
      },
      {
        name: 'MedPlus Pharmacy',
        address: 'Kondapur, Hyderabad',
        latitude: 17.4617,
        longitude: 78.3654,
        owner: admin._id,
      },
    ];

    const pharmacies = [];
    for (const data of pharmacyData) {
      let pharmacy = await Pharmacy.findOne({ name: data.name });
      if (!pharmacy) {
        pharmacy = await Pharmacy.create(data);
        console.log(`✓ Created pharmacy: ${data.name}`);
      } else {
        console.log(`✓ Pharmacy already exists: ${data.name}`);
      }
      pharmacies.push(pharmacy);
    }

    // Create medicines with prices in Indian Rupees (INR)
    const medicineData = [
      {
        name: 'Paracetamol 500mg',
        brand: 'Crocin',
        description: 'Pain reliever and fever reducer',
        unitPrice: 25,
        sku: 'PARA-500',
      },
      {
        name: 'Ibuprofen 200mg',
        brand: 'Brufen',
        description: 'Anti-inflammatory pain reliever',
        unitPrice: 35,
        sku: 'IBU-200',
      },
      {
        name: 'Amoxicillin 250mg',
        brand: 'Novamox',
        description: 'Antibiotic for bacterial infections',
        unitPrice: 85,
        sku: 'AMOX-250',
      },
      {
        name: 'Cetirizine 10mg',
        brand: 'Okacet',
        description: 'Antihistamine for allergies',
        unitPrice: 40,
        sku: 'CET-10',
      },
      {
        name: 'Omeprazole 20mg',
        brand: 'Omez',
        description: 'Reduces stomach acid',
        unitPrice: 65,
        sku: 'OME-20',
      },
      {
        name: 'Metformin 500mg',
        brand: 'Glycomet',
        description: 'Type 2 diabetes medication',
        unitPrice: 50,
        sku: 'MET-500',
      },
      {
        name: 'Aspirin 75mg',
        brand: 'Disprin',
        description: 'Low-dose aspirin for heart health',
        unitPrice: 20,
        sku: 'ASP-75',
      },
      {
        name: 'Vitamin D3 1000IU',
        brand: 'Shelcal',
        description: 'Vitamin D supplement',
        unitPrice: 70,
        sku: 'VITD-1000',
      },
      {
        name: 'Azithromycin 500mg',
        brand: 'Azithral',
        description: 'Antibiotic for respiratory infections',
        unitPrice: 120,
        sku: 'AZI-500',
      },
      {
        name: 'Pantoprazole 40mg',
        brand: 'Pan',
        description: 'Treats acid reflux and GERD',
        unitPrice: 55,
        sku: 'PAN-40',
      },
    ];

    const medicines = [];
    for (const data of medicineData) {
      let medicine = await Medicine.findOne({ name: data.name });
      if (!medicine) {
        medicine = await Medicine.create(data);
        console.log(`✓ Created medicine: ${data.name}`);
      } else {
        console.log(`✓ Medicine already exists: ${data.name}`);
      }
      medicines.push(medicine);
    }

    // Create inventory for each pharmacy
    for (const pharmacy of pharmacies) {
      for (const medicine of medicines) {
        const existing = await Inventory.findOne({
          pharmacy: pharmacy._id,
          medicine: medicine._id,
        });

        if (!existing) {
          const quantity = Math.floor(Math.random() * 100) + 20; // Random quantity between 20-120
          await Inventory.create({
            pharmacy: pharmacy._id,
            medicine: medicine._id,
            quantity,
          });
          console.log(`✓ Added inventory: ${medicine.name} at ${pharmacy.name} (${quantity} units)`);
        }
      }
    }

    console.log('\n✓✓✓ Seed completed successfully! ✓✓✓\n');
    console.log('Login Credentials:');
    console.log('  Email: admin@demo.com');
    console.log('  Password: password');
    console.log('\nYou can now start the backend server with: npm run dev\n');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
