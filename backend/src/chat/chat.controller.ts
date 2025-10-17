import { Controller, Get, Post, Body, UseGuards, Req, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('messages')
  async getMessages() {
    return this.chatService.getMessages();
  }

  @Post('send')
  async sendMessage(@Req() req, @Body() messageData: any) {
    const { content, receiverId } = messageData;
    return this.chatService.sendMessage(req.user.userId, content, receiverId);
  }

  @Get('private/:receiverId')
  async getPrivateMessages(@Req() req, @Param('receiverId', ParseIntPipe) receiverId: number) {
    return this.chatService.getPrivateMessages(req.user.userId, receiverId);
  }
}