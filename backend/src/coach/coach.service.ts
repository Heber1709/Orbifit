import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CoachService {
  constructor(private prisma: PrismaService) {}

  async getPlayers(coachId: number) {
    try {
      const players = await this.prisma.user.findMany({
        where: { 
          role: 'JUGADOR',
          isActive: true 
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          position: true,
          jerseyNumber: true,
          age: true
        },
        orderBy: {
          firstName: 'asc'
        }
      });

      const formattedPlayers = players.map(player => ({
        id: player.id,
        name: `${player.firstName} ${player.lastName}`,
        position: player.position || 'Sin posición',
        jerseyNumber: player.jerseyNumber,
        age: player.age
      }));

      return formattedPlayers;
    } catch (error) {
      throw new Error('Error al cargar los jugadores');
    }
  }

  async getTeamStats(coachId: number) {
    try {
      const activePlayers = await this.prisma.user.count({
        where: { 
          role: 'JUGADOR',
          isActive: true 
        }
      });

      const trainings = await this.prisma.training.count({
        where: { coachId }
      });

      return {
        activePlayers,
        trainings,
        matchesPlayed: 0,
        wins: 0,
        topPlayers: []
      };
    } catch (error) {
      throw new Error('Error al cargar las estadísticas');
    }
  }

  async getCoachProfile(coachId: number) {
    try {
      const coach = await this.prisma.user.findUnique({
        where: { id: coachId },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          phone: true,
          license: true,
          experienceYears: true,
          specialization: true
        }
      });

      if (!coach) {
        throw new Error('Entrenador no encontrado');
      }

      return coach;
    } catch (error) {
      throw new Error('Error al cargar el perfil del entrenador');
    }
  }
}