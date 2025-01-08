import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './orders.service';
import { Order } from './order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UserRole } from 'users/user.roles.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully.' })
  @ApiBody({ type: CreateOrderDto })
  async createOrder(@Body() orderData: CreateOrderDto): Promise<Order> {
    return this.orderService.create(orderData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Return all orders.' })
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiResponse({ status: 200, description: 'Return an order.' })
  @ApiParam({ name: 'id', description: 'The ID of the order' })
  async getOrderById(@Param('id') id: string): Promise<Order> {
    return this.orderService.getOrderById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an order by ID' })
  @ApiResponse({ status: 200, description: 'Order updated successfully.' })
  @ApiParam({ name: 'id', description: 'The ID of the order' })
  @ApiBody({ type: CreateOrderDto })
  async updateOrder(
    @Param('id') id: string,
    @Body() orderData: Partial<Order>,
  ): Promise<Order> {
    return this.orderService.updateOrder(id, orderData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully.' })
  @ApiParam({ name: 'id', description: 'The ID of the order' })
  async deleteOrder(@Param('id') id: string): Promise<Order> {
    return this.orderService.deleteOrder(id);
  }

  @Delete(':id/cancel')
  @ApiOperation({ summary: 'Cancel an order by ID' })
  @ApiResponse({ status: 200, description: 'Order canceled successfully.' })
  @ApiParam({ name: 'id', description: 'The ID of the order' })
  async cancelOrder(@Param('id') id: string): Promise<Order> {
    return this.orderService.updateOrder(id, { status: 'canceled' });
  }
}
