import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany(); // first we are removing any already present data in there.
    await Product.deleteMany();
    await User.deleteMany();

    // import the user
    const createdUsers = await User.insertMany(users); // inserting the users data file using the user model.

    const adminUser = createdUsers[0]._id;

    // putting a admin (to show who have created the product) in every product.
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    //inserting products to the db
    await Product.insertMany(sampleProducts);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // if we type -d in console we want to destroy the data
  destroyData();
} else {
  importData();
}
