import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './orders/order.schema';
import { MenuItem } from './menu/menu.schema';
import { User } from './users/user.schema';
import { AuthModule } from './auth/auth.module';

async function clearDatabase() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const orderModel = app.get<Model<Order>>('OrderModel');
  const menuItemModel = app.get<Model<MenuItem>>('MenuItemModel');
  const userModel = app.get<Model<User>>('UserModel');

  try {
    await orderModel.deleteMany({});
    await menuItemModel.deleteMany({});
    await userModel.deleteMany({});
    console.log('Database cleared successfully.');
  } catch (error) {
    console.error('Error clearing the database:', error);
  } finally {
    await app.close();
  }
}

// Execute the script
clearDatabase();
