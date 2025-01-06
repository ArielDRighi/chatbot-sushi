import { ChatbotService } from './chatbot.service';
export declare class ChatbotController {
    private readonly chatbotService;
    constructor(chatbotService: ChatbotService);
    handleMessage(message: string): Promise<{
        response: string;
    }>;
}
