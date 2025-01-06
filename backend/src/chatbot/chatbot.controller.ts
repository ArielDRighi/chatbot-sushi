import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  @ApiOperation({ summary: 'Handle chatbot message' })
  @ApiResponse({ status: 200, description: 'Message handled successfully.' })
  @ApiBody({ schema: { example: { message: 'Quiero 2 sushi de salmón' } } })
  async handleMessage(
    @Body('message') message: string,
  ): Promise<{ response: string }> {
    const response = await this.chatbotService.handleMessage(message);
    return { response };
  }
}
