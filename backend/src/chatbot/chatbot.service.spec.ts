import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotService } from './chatbot.service';
import { MenuService } from '../menu/menu.service';
import { OrderService } from '../orders/orders.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../users/user.schema';
import { Order } from '../orders/order.schema';
import { MenuItem } from '../menu/menu.schema';
import { Types } from 'mongoose';

describe('ChatbotService', () => {
  let service: ChatbotService;
  let menuService: MenuService;
  let orderService: OrderService;
  let jwtService: JwtService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatbotService,
        {
          provide: MenuService,
          useValue: {
            getAllItems: jest.fn(),
            getItemById: jest.fn(),
            getItemByName: jest.fn(),
          },
        },
        {
          provide: OrderService,
          useValue: { getOrdersByUserId: jest.fn(), create: jest.fn() },
        },
        { provide: JwtService, useValue: { verify: jest.fn() } },
        { provide: UserService, useValue: { findOneById: jest.fn() } },
      ],
    }).compile();

    service = module.get<ChatbotService>(ChatbotService);
    menuService = module.get<MenuService>(MenuService);
    orderService = module.get<OrderService>(OrderService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return login message if token is invalid', async () => {
    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });
    const response = await service.handleMessage(
      'estado de mi orden',
      'invalid-token',
    );
    expect(response).toBe(
      'Por favor, inicia sesión o crea una cuenta para continuar.',
    );
  });

  it('should return order status if user is authenticated', async () => {
    const user: User = new User({
      _id: new Types.ObjectId('user-id'),
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      role: 'user',
      // Añadir propiedades adicionales si es necesario
    });

    const orders: Order[] = [
      new Order({
        _id: new Types.ObjectId('order-id'),
        items: [{ productId: new Types.ObjectId('product-id'), quantity: 2 }],
        status: 'pending',
        customerName: 'Test User',
        total: 20,
        createdAt: new Date(),
        userId: new Types.ObjectId('user-id'),
        // Añadir propiedades adicionales si es necesario
      }),
    ];

    const menuItem: MenuItem = new MenuItem({
      _id: new Types.ObjectId('product-id'),
      name: 'Sushi',
      price: 10,
      description: 'Delicious sushi',
      available: true,
      // Añadir propiedades adicionales si es necesario
    });

    jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: 'user-id' });
    jest.spyOn(userService, 'findOneById').mockResolvedValue(user);
    jest.spyOn(orderService, 'getOrdersByUserId').mockResolvedValue(orders);
    jest.spyOn(menuService, 'getItemById').mockResolvedValue(menuItem);

    const response = await service.handleMessage(
      'estado de mi orden',
      'valid-token',
    );
    expect(response).toContain('📦 Aquí tienes el estado de tus órdenes:');
  });

  it('should return menu items', async () => {
    const menuItems: MenuItem[] = [
      {
        name: 'Sushi',
        price: 10,
        description: 'Delicious sushi',
        available: true,
      } as MenuItem,
    ];
    jest.spyOn(menuService, 'getAllItems').mockResolvedValue(menuItems);

    const response = await service.handleMessage('menu', '');
    expect(response).toContain('🍣 A continuación te presento el menú:');
  });

  it('should create an order if user is authenticated', async () => {
    const user: User = { _id: 'user-id', name: 'Test User' } as User;
    const menuItem: MenuItem = {
      _id: 'product-id',
      name: 'Sushi',
      price: 10,
      description: 'Delicious sushi',
      available: true,
    } as MenuItem;
    const orderDetails = [{ itemName: 'sushi de salmon', quantity: 2 }];

    jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: 'user-id' });
    jest.spyOn(userService, 'findOneById').mockResolvedValue(user);
    jest.spyOn(menuService, 'getItemByName').mockResolvedValue(menuItem);
    jest.spyOn(orderService, 'create').mockResolvedValue({
      _id: 'order-id',
      customerName: 'Test User',
      items: [{ productId: 'product-id', quantity: 2 }],
      total: 20,
      status: 'pending',
      createdAt: new Date(),
      userId: 'user-id',
    } as Order);

    const response = await service.handleMessage(
      'quiero 2 sushi de salmon',
      'valid-token',
    );
    expect(response).toContain('✅ Tu orden ha sido registrada.');
  });

  it('should return recommendations', async () => {
    const recommendations: MenuItem[] = [
      {
        name: 'Sushi',
        price: 10,
        description: 'Delicious sushi',
        available: true,
      } as MenuItem,
    ];
    jest.spyOn(menuService, 'getAllItems').mockResolvedValue(recommendations);

    const response = await service.handleMessage('recomendar', '');
    expect(response).toContain('🔍 Aquí tienes algunas recomendaciones:');
  });

  it('should return business hours', async () => {
    const response = await service.handleMessage('horarios', '');
    expect(response).toBe(
      '🕒 Estamos abiertos de lunes a domingo, de 12:00 a 22:00.',
    );
  });

  it('should return thank you response', async () => {
    const response = await service.handleMessage('gracias', '');
    expect(response).toBe(
      '🙏 ¡De nada! Si tienes alguna otra pregunta, no dudes en preguntar.',
    );
  });

  it('should return goodbye response', async () => {
    const response = await service.handleMessage('adios', '');
    expect(response).toBe('👋 ¡Adiós! ¡Que tengas un excelente día!');
  });

  it('should return default response for unknown message', async () => {
    const response = await service.handleMessage('unknown message', '');
    expect(response).toBe(
      'Lo siento, no entendí tu mensaje. Puedes intentar con: "Mostrar menú" o "¿Qué me recomiendas?".',
    );
  });
});
