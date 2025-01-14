import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  @ApiOperation({ summary: 'Handle chatbot message' })
  @ApiResponse({ status: 200, description: 'Message handled successfully.' })
  @ApiBody({ schema: { example: { message: 'Quiero 2 sushi de salmón' } } })
  async handleMessage(
    @Body('message') message: string,
    @Headers('Authorization') authHeader: string,
  ): Promise<{ response: string; menuItems?: any[] }> {
    const token = authHeader?.split(' ')[1]; // Extraer el token del encabezado
    const response = await this.chatbotService.handleMessage(message, token);
    if (message.toLowerCase().includes('menu')) {
      const menuItems = await this.chatbotService.getMenuItems();
      return { response, menuItems };
    }
    return { response };
  }
}
