import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './orders.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  let orderModelMock: any;
  let menuItemModelMock: any;

  beforeEach(async () => {
    // Crear mocks de los modelos
    orderModelMock = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      deleteMany: jest.fn(),
      exec: jest.fn(),
      save: jest.fn(),
      create: jest.fn().mockImplementation((dto) => ({
        ...dto,
        save: jest.fn().mockResolvedValue(dto),
      })), // Añadir el método create al mock
    };

    menuItemModelMock = {
      findById: jest.fn().mockReturnValue({ exec: jest.fn() }),
      exec: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getModelToken('Order'), useValue: orderModelMock },
        { provide: getModelToken('MenuItem'), useValue: menuItemModelMock },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      const mockOrders = [{ id: '1' }, { id: '2' }];
      orderModelMock.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockOrders),
      });

      const result = await service.getAllOrders();

      expect(orderModelMock.find).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });
  });

  describe('getOrderById', () => {
    it('should return an order by ID', async () => {
      const mockOrder = { id: '1' };
      orderModelMock.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockOrder),
      });

      const result = await service.getOrderById('1');

      expect(orderModelMock.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockOrder);
    });

    it('should throw a NotFoundException if order is not found', async () => {
      orderModelMock.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getOrderById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order successfully', async () => {
      const mockOrder = { id: '1' };
      orderModelMock.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockOrder),
      });

      const result = await service.deleteOrder('1');

      expect(orderModelMock.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockOrder);
    });

    it('should throw a NotFoundException if order is not found', async () => {
      orderModelMock.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.deleteOrder('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOrder', () => {
    it('should update an order successfully', async () => {
      const mockUpdatedOrder = { id: '1', customerName: 'Updated Name' };
      const mockMenuItem = { price: 10 };

      menuItemModelMock.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMenuItem),
      });
      orderModelMock.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUpdatedOrder),
      });

      const updateOrderDto = {
        customerName: 'Updated Name',
        items: [{ productId: 'menu1', quantity: 2 }],
      };

      const result = await service.updateOrder('1', updateOrderDto);

      expect(menuItemModelMock.findById).toHaveBeenCalledWith('menu1');
      expect(orderModelMock.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedOrder);
    });

    it('should throw an error if menu item is not found', async () => {
      menuItemModelMock.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const updateOrderDto = {
        customerName: 'Updated Name',
        items: [{ productId: 'menu1', quantity: 2 }],
      };

      await expect(service.updateOrder('1', updateOrderDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
