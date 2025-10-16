import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('general')
  getGeneralMessages() {
    return this.chatService.getGeneralMessages();
  }

  @Get('private/:receiverId')
  getPrivateMessages(@Param('receiverId') receiverId: string, @Request() req) {
    return this.chatService.getPrivateMessages(
      req.user.userId,
      parseInt(receiverId),
    );
  }

  @Post('message')
  sendMessage(@Body() messageData: any, @Request() req) {
    return this.chatService.sendMessage({
      ...messageData,
      senderId: req.user.userId,
    });
  }

  @Get('online-users')
  getOnlineUsers() {
    return this.chatService.getOnlineUsers();
  }
}