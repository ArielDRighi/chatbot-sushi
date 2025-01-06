import { Document } from 'mongoose';
declare class OrderItem {
    productId: string;
    quantity: number;
}
export declare class Order extends Document {
    customerName: string;
    items: OrderItem[];
    total: number;
    status: string;
    createdAt: Date;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order> & Order & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>> & import("mongoose").FlatRecord<Order> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export {};
