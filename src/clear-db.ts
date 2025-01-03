import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MenuService } from './menu/menu.service';
import { OrderService } from './orders/orders.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const menuService = app.get(MenuService);
  const orderService = app.get(OrderService);

  // Borrar todos los datos de la colección de menú
  await menuService.deleteAll();

  // Borrar todos los datos de la colección de órdenes
  await orderService.deleteAll();

  await app.close();
}

bootstrap();
