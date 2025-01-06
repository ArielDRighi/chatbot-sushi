import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuItem, MenuItemSchema } from './menu.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MenuItem.name, schema: MenuItemSchema },
    ]),
    AuthModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MongooseModule],
})
export class MenuModule {}
