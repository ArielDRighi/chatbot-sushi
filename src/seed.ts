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

  // Insertar datos en la colección de menú
  for (const item of menuItems) {
    await menuService.create(item);
  }

  // Datos de ejemplo para las órdenes
  const orders = [
    {
      customerName: 'Juan Pérez',
      items: [
        { productId: '1', quantity: 2 },
        { productId: '2', quantity: 1 },
      ],
      total: 34.97,
      status: 'completed',
      createdAt: new Date(),
    },
    {
      customerName: 'María López',
      items: [{ productId: '3', quantity: 3 }],
      total: 35.97,
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
