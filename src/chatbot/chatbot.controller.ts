import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  async handleMessage(
    @Body('message') message: string,
  ): Promise<{ response: string }> {
    const response = await this.chatbotService.handleMessage(message);
    return { response };
  }
}
