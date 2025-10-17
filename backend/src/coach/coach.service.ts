import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CoachService {
  constructor(private prisma: PrismaService) {}

  async getPlayers(coachId: number) {
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
      },
      orderBy: {
        firstName: 'asc'
      }
    });

    return players.map(player => ({
      id: player.id,
      name: `${player.firstName} ${player.lastName}`,
      position: player.position || 'Sin posición',
    }));
  }

  async getTeamStats(coachId: number) {
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
    };
  }

  async getCoachProfile(coachId: number) {
    const coach = await this.prisma.user.findUnique({
      where: { id: coachId },
      select: {
        id: true,
        email: true,
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
  }

  async getCoachTrainings(coachId: number) {
    return await this.prisma.training.findMany({
      where: { 
        coachId: coachId 
      },
      include: {
        participants: {
          include: {
            player: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
  }

  async createTraining(coachId: number, trainingData: any) {
    const { title, description, type, date, duration, playerIds } = trainingData;

    const trainingDataForPrisma: any = {
      title,
      description,
      type,
      date: new Date(date),
      duration: parseInt(duration.toString()),
      coachId: parseInt(coachId.toString()),
    };

    if (playerIds && playerIds.length > 0) {
      trainingDataForPrisma.participants = {
        create: playerIds.map((playerId: number) => ({
          playerId: parseInt(playerId.toString())
        }))
      };
    }

    return await this.prisma.training.create({
      data: trainingDataForPrisma,
      include: {
        participants: {
          include: {
            player: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
  }

  async updateTraining(trainingId: number, trainingData: any, coachId: number) {
    console.log('🔄 SERVICE: Actualizando entrenamiento', trainingId);
    
    const existing = await this.prisma.training.findFirst({
      where: { 
        id: trainingId,
        coachId: coachId 
      }
    });

    if (!existing) {
      throw new Error('Entrenamiento no encontrado');
    }

    const updateData: any = {
      title: trainingData.title,
      description: trainingData.description,
      type: trainingData.type,
      duration: parseInt(trainingData.duration.toString()),
    };

    if (trainingData.date) {
      updateData.date = new Date(trainingData.date);
    }

    const result = await this.prisma.training.update({
      where: { id: trainingId },
      data: updateData,
    });

    console.log('✅ SERVICE: Actualizado exitosamente');
    return result;
  }

  async deleteTraining(trainingId: number, coachId: number) {
    console.log('🗑️ SERVICE: Eliminando entrenamiento', trainingId);
    
    const existing = await this.prisma.training.findFirst({
      where: { 
        id: trainingId,
        coachId: coachId 
      }
    });

    if (!existing) {
      throw new Error('Entrenamiento no encontrado');
    }

    await this.prisma.trainingParticipant.deleteMany({
      where: { trainingId: trainingId }
    });

    await this.prisma.training.delete({
      where: { id: trainingId }
    });

    console.log('✅ SERVICE: Eliminado exitosamente');
    return { 
      success: true,
      message: 'Entrenamiento eliminado exitosamente' 
    };
  }

  async saveTrainingResults(coachId: number, resultsData: any) {
    console.log('💾 SERVICE: Guardando resultados de entrenamiento');
    console.log('📊 Datos:', resultsData);

    const { trainingId, players, generalObservations, rating } = resultsData;

    const training = await this.prisma.training.findFirst({
      where: { 
        id: parseInt(trainingId.toString()),
        coachId: coachId 
      },
      include: {
        participants: {
          include: {
            player: true
          }
        }
      }
    });

    if (!training) {
      throw new Error('Entrenamiento no encontrado o no autorizado');
    }

    try {
      // Guardar resultados para cada jugador
      for (const [playerName, playerData] of Object.entries(players)) {
        const nameParts = playerName.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

        const player = await this.prisma.user.findFirst({
          where: {
            firstName: firstName,
            lastName: lastName,
            role: 'JUGADOR'
          }
        });

        if (player) {
          const playerResultData: any = playerData;
          
          await this.prisma.trainingResult.upsert({
            where: {
              trainingId_playerId: {
                trainingId: parseInt(trainingId.toString()),
                playerId: player.id
              }
            },
            update: {
              endurance: this.mapRatingToNumber(playerResultData.endurance),
              technique: this.mapRatingToNumber(playerResultData.technique),
              attitude: this.mapRatingToNumber(playerResultData.attitude),
              notes: playerResultData.observations || '',
            },
            create: {
              trainingId: parseInt(trainingId.toString()),
              playerId: player.id,
              endurance: this.mapRatingToNumber(playerResultData.endurance),
              technique: this.mapRatingToNumber(playerResultData.technique),
              attitude: this.mapRatingToNumber(playerResultData.attitude),
              notes: playerResultData.observations || '',
            }
          });
        }
      }

      console.log('✅ SERVICE: Resultados guardados exitosamente');
      return { 
        success: true,
        message: 'Resultados guardados correctamente'
      };

    } catch (error) {
      console.error('❌ SERVICE: Error guardando resultados:', error);
      throw new Error('Error al guardar los resultados: ' + error.message);
    }
  }

  async getTrainingResults(coachId: number, trainingId: number) {
    console.log('📋 SERVICE: Obteniendo resultados del entrenamiento', trainingId);

    const training = await this.prisma.training.findFirst({
      where: { 
        id: trainingId,
        coachId: coachId 
      }
    });

    if (!training) {
      throw new Error('Entrenamiento no encontrado o no autorizado');
    }

    try {
      const trainingResults = await this.prisma.trainingResult.findMany({
        where: { trainingId },
        include: {
          player: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              position: true
            }
          }
        }
      });

      // Convertir a formato que espera el frontend
      const players: any = {};
      trainingResults.forEach(result => {
        const playerName = `${result.player.firstName} ${result.player.lastName}`;
        players[playerName] = {
          endurance: this.mapNumberToRating(result.endurance),
          technique: this.mapNumberToRating(result.technique),
          attitude: this.mapNumberToRating(result.attitude),
          observations: result.notes || ''
        };
      });

      return {
        trainingId,
        players,
        generalObservations: '',
        rating: 0,
        playerResults: trainingResults
      };

    } catch (error) {
      console.error('❌ SERVICE: Error obteniendo resultados:', error);
      return {
        trainingId,
        players: {},
        generalObservations: '',
        rating: 0,
        playerResults: []
      };
    }
  }

  async deleteTrainingResults(coachId: number, trainingId: number) {
  console.log('🗑️ SERVICE: Eliminando resultados del entrenamiento', trainingId);

  // Verificar que el entrenamiento pertenece al coach
  const training = await this.prisma.training.findFirst({
    where: { 
      id: trainingId,
      coachId: coachId 
    }
  });

  if (!training) {
    throw new Error('Entrenamiento no encontrado o no autorizado');
  }

  try {
    // Eliminar resultados de jugadores
    await this.prisma.trainingResult.deleteMany({
      where: { trainingId: trainingId }
    });

    console.log('✅ SERVICE: Resultados eliminados exitosamente');
    return { 
      success: true,
      message: 'Resultados eliminados correctamente'
    };

  } catch (error) {
    console.error('❌ SERVICE: Error eliminando resultados:', error);
    throw new Error('Error al eliminar los resultados: ' + error.message);
  }
}

  async getAllTrainingResults(coachId: number) {
    console.log('📋 SERVICE: Obteniendo todos los resultados del coach', coachId);

    try {
      // Obtener entrenamientos del coach
      const trainings = await this.prisma.training.findMany({
        where: { coachId },
        select: {
          id: true,
          title: true,
          date: true,
          type: true
        }
      });

      // Para cada entrenamiento, obtener resultados
      const resultsWithDetails = await Promise.all(
        trainings.map(async (training) => {
          const trainingResults = await this.prisma.trainingResult.findMany({
            where: { trainingId: training.id },
            include: {
              player: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          });

          return {
            trainingId: training.id,
            training: training,
            playerResults: trainingResults,
            generalObservations: '',
            rating: 0,
            updatedAt: new Date()
          };
        })
      );

      console.log('✅ Resultados encontrados:', resultsWithDetails.length);
      return resultsWithDetails;

    } catch (error) {
      console.error('❌ SERVICE: Error obteniendo todos los resultados:', error);
      return [];
    }
  }

  private mapRatingToNumber(rating: string): number {
    const ratingMap: { [key: string]: number } = {
      'excellent': 5,
      'good': 4,
      'regular': 3,
      'needs_improvement': 2
    };
    return ratingMap[rating] || 3;
  }

  private mapNumberToRating(number: number | null): string {
    if (number === null) return 'good';
    
    const ratingMap: { [key: number]: string } = {
      5: 'excellent',
      4: 'good',
      3: 'regular',
      2: 'needs_improvement'
    };
    return ratingMap[number] || 'good';
  }
}