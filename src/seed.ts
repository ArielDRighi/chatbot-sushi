import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MenuService } from './menu/menu.service';
import { OrderService } from './orders/orders.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const menuService = app.get(MenuService);
  const orderService = app.get(OrderService);

  // Datos de ejemplo para el menú
  const menuItems = [
    {
      name: 'Sushi de Salmón',
      description: 'Delicioso sushi de salmón fresco',
      price: 10.99,
      available: true,
    },
    {
      name: 'Sushi de Atún',
      description: 'Sushi de atún con un toque de wasabi',
      price: 12.99,
      available: true,
    },
    {
      name: 'Sushi de Camarón',
      description: 'Sushi de camarón con salsa especial',
      price: 11.99,
      available: true,
    },
  ];

  // Insertar datos en la colección de menú y capturar los IDs generados
  const insertedMenuItems = [];
  for (const item of menuItems) {
    const insertedItem = await menuService.create(item);
    insertedMenuItems.push(insertedItem);
  }

  // Datos de ejemplo para las órdenes utilizando los IDs generados
  const orders = [
    {
      customerName: 'Juan Pérez',
      items: [
        { productId: insertedMenuItems[0]._id, quantity: 2 },
        { productId: insertedMenuItems[1]._id, quantity: 1 },
      ],
      status: 'completed',
      createdAt: new Date(),
    },
    {
      customerName: 'María López',
      items: [{ productId: insertedMenuItems[2]._id, quantity: 3 }],
      status: 'pending',
      createdAt: new Date(),
    },
  ];

  // Insertar datos en la colección de órdenes
  for (const order of orders) {
    await orderService.create(order);
  }

  await app.close();
}

bootstrap();
