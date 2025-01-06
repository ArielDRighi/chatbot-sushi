declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    customerName: string;
    items: OrderItemDto[];
    total: number;
    status?: string;
    createdAt?: Date;
}
export {};
