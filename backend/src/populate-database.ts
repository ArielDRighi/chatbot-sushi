import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users/user.schema';
import { MenuItem } from './menu/menu.schema';
import { UserRole } from './users/user.roles.enum';
import * as bcrypt from 'bcrypt';

async function populateDatabase() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get<Model<User>>('UserModel');
  const menuItemModel = app.get<Model<MenuItem>>('MenuItemModel');

  try {
    // Crear usuario de ejemplo
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = new userModel({
      name: 'Ariel Righi',
      email: 'ariel.righi@example.com',
      password: hashedPassword,
      role: UserRole.CUSTOMER,
    });
    await user.save();

    // Crear menús de sushi de ejemplo
    const menuItems = [
      {
        name: 'Sushi de Salmón',
        description: 'Delicioso sushi de salmón',
        price: 10.99,
        available: true,
      },
      {
        name: 'Sushi de Atún',
        description: 'Fresco sushi de atún',
        price: 12.99,
        available: true,
      },
      {
        name: 'Sushi de Camarón',
        description: 'Sushi de camarón',
        price: 11.99,
        available: true,
      },
      {
        name: 'Sushi de Anguila',
        description: 'Sushi de anguila',
        price: 13.99,
        available: true,
      },
      {
        name: 'Sushi de Pulpo',
        description: 'Sushi de pulpo',
        price: 14.99,
        available: true,
      },
      {
        name: 'Sushi de Cangrejo',
        description: 'Sushi de cangrejo',
        price: 15.99,
        available: true,
      },
      {
        name: 'Sushi de Calamar',
        description: 'Sushi de calamar',
        price: 9.99,
        available: true,
      },
      {
        name: 'Sushi de Pez Mantequilla',
        description: 'Sushi de pez mantequilla',
        price: 16.99,
        available: true,
      },
      {
        name: 'Sushi de Caballa',
        description: 'Sushi de caballa',
        price: 8.99,
        available: true,
      },
      {
        name: 'Sushi de Huevo',
        description: 'Sushi de huevo',
        price: 7.99,
        available: true,
      },
    ];

    await menuItemModel.insertMany(menuItems);

    console.log('Database populated successfully.');
  } catch (error) {
    console.error('Error populating the database:', error);
  } finally {
    await app.close();
  }
}

// Execute the script
populateDatabase();
