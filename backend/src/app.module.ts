import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MenuModule } from './menu/menu.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from './orders/orders.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { DebugMiddleware } from '../middleware/debug.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MenuModule,
    OrderModule,
    ChatbotModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DebugMiddleware).forRoutes('*'); // Esto aplica el middleware en todas las rutas
  }
}
