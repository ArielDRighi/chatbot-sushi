import { Document } from 'mongoose';
export declare class MenuItem extends Document {
    name: string;
    description: string;
    price: number;
    available: boolean;
}
export declare const MenuItemSchema: import("mongoose").Schema<MenuItem, import("mongoose").Model<MenuItem, any, any, any, Document<unknown, any, MenuItem> & MenuItem & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MenuItem, Document<unknown, {}, import("mongoose").FlatRecord<MenuItem>> & import("mongoose").FlatRecord<MenuItem> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
