import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CoachService } from './coach.service';

@Controller('coach')
@UseGuards(AuthGuard('jwt'))
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Get('players')
  async getPlayers(@Req() req) {
    return this.coachService.getPlayers(req.user.id);
  }

  @Get('stats')
  async getTeamStats(@Req() req) {
    return this.coachService.getTeamStats(req.user.id);
  }

  @Get('profile')
  async getCoachProfile(@Req() req) {
    return this.coachService.getCoachProfile(req.user.id);
  }
}