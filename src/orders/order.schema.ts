import { Schema, Document } from 'mongoose';

export interface Order extends Document {
  customerName: string;
  items: {
    productId: string; // ID del producto pedido
    quantity: number; // Cantidad de ese producto
  }[];
  total: number; // Total del pedido
  status: string; // Estado del pedido (ejemplo: pendiente, completado)
  createdAt: Date; // Fecha de creación
}

export const OrderSchema = new Schema<Order>({
  customerName: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});
