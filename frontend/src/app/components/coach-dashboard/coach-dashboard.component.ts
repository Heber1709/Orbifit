import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TrainingService } from '../../services/training.service';

interface CoachProfile {
  fullName: string;
  email: string;
  specialization: string;  
  experienceYears: number; 
  license: string;
  phone: string;
}

interface Training {
  type: string;
  date: string;
  time: string;
  duration: number;
  description: string;
}

interface Player {
  id: number;
  name: string;
  position: string;
  selected: boolean;
  endurance?: string;
  technique?: string;
  attitude?: string;
}

interface TeamStats {
  activePlayers: number;
  trainings: number;
  matchesPlayed: number;
  wins: number;
}

interface TopPlayer {
  name: string;
  goals: number;
  assists: number;
}

@Component({
  selector: 'app-coach-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coach-dashboard.component.html',
  styleUrls: ['./coach-dashboard.component.scss']
})
export class CoachDashboardComponent implements OnInit {
  currentUser: any;
  currentView: string = 'welcome';
  loading: boolean = false;
  
  calendarVisible = false;
  chatVisible = false;
  
  coachProfile: CoachProfile = {
    fullName: '',
    email: '',
    specialization: '',
    experienceYears: 0,
    license: '',
    phone: ''
  };

  newTraining: Training = {
    type: 'Entrenamiento Físico',
    date: '',
    time: '',
    duration: 90,
    description: ''
  };

  teamPlayers: Player[] = [];
  teamStats: TeamStats = {
    activePlayers: 0,
    trainings: 0,
    matchesPlayed: 0,
    wins: 0
  };

  topPlayers: TopPlayer[] = [];
  trainingNotes: string = '';
  trainingRating: number = 5;

  constructor(
    private authService: AuthService,
    private trainingService: TrainingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    // ✅ CARGAR PERFIL COMPLETO DESDE BD
    this.loadUserProfile();
    this.loadTeamPlayers();
    this.loadTeamStats();
  }

  // ✅ NUEVO MÉTODO: Cargar perfil completo desde BD
  loadUserProfile() {
    this.loading = true;
    this.authService.loadUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.coachProfile = {
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          specialization: user.specialization || 'Entrenamiento Físico',
          experienceYears: user.experienceYears || 0,
          license: user.license || '',
          phone: user.phone || ''
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando perfil:', error);
        // Si falla, usar datos del localStorage
        this.coachProfile = {
          fullName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
          email: this.currentUser.email,
          specialization: this.currentUser.specialization || 'Entrenamiento Físico',
          experienceYears: this.currentUser.experienceYears || 0,
          license: this.currentUser.license || '',
          phone: this.currentUser.phone || ''
        };
        this.loading = false;
      }
    });
  }

  // Cargar jugadores del equipo desde BD - SOLO DATOS REALES
  loadTeamPlayers() {
    this.loading = true;
    this.trainingService.getTeamPlayers().subscribe({
      next: (players) => {
        this.teamPlayers = players.map((player: any) => ({
          ...player,
          selected: true
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando jugadores:', error);
        this.loading = false;
        alert('Error al cargar los jugadores del equipo');
      }
    });
  }

  // Cargar estadísticas del equipo desde BD - SOLO DATOS REALES
  loadTeamStats() {
    this.trainingService.getTeamStats().subscribe({
      next: (stats) => {
        this.teamStats = stats;
        this.topPlayers = stats.topPlayers || [];
      },
      error: (error) => {
        console.error('Error cargando estadísticas:', error);
      }
    });
  }

  // Navigation methods
  showWelcome() {
    this.currentView = 'welcome';
  }

  showCoachProfile() {
    this.currentView = 'profile';
  }

  showScheduleTraining() {
    this.currentView = 'schedule';
  }

  showRecordResults() {
    this.currentView = 'record';
  }

  showTeamStats() {
    this.currentView = 'teamstats';
  }

  // Métodos para calendario y chat
  toggleCalendar() {
    this.calendarVisible = !this.calendarVisible;
    if (this.calendarVisible) this.chatVisible = false;
  }

  toggleChat() {
    this.chatVisible = !this.chatVisible;
    if (this.chatVisible) this.calendarVisible = false;
  }

  // Actualizar perfil usando el método genérico
  updateCoachProfile() {
    this.loading = true;
    
    const profileData = {
      specialization: this.coachProfile.specialization,  
      experienceYears: this.coachProfile.experienceYears, 
      license: this.coachProfile.license,
      phone: this.coachProfile.phone
    };

    this.authService.updateUserProfile(profileData).subscribe({
      next: (updatedUser) => {
        this.loading = false;
        // ✅ ACTUALIZAR CON DATOS DEL BACKEND
        this.coachProfile = {
          fullName: `${updatedUser.firstName} ${updatedUser.lastName}`,
          email: updatedUser.email,
          specialization: updatedUser.specialization || 'Entrenamiento Físico',
          experienceYears: updatedUser.experienceYears || 0,
          license: updatedUser.license || '',
          phone: updatedUser.phone || ''
        };
        alert('Perfil actualizado correctamente');
      },
      error: (error) => {
        this.loading = false;
        console.error('Error actualizando perfil:', error);
        alert('Error al actualizar el perfil');
      }
    });
  }

  // Crear entrenamiento en BD
  createTraining() {
    const selectedPlayers = this.teamPlayers.filter(player => player.selected);
    
    if (!this.newTraining.date || !this.newTraining.time) {
      alert('Por favor completa la fecha y hora del entrenamiento');
      return;
    }

    if (selectedPlayers.length === 0) {
      alert('Selecciona al menos un jugador para el entrenamiento');
      return;
    }

    const trainingData = {
      ...this.newTraining,
      players: selectedPlayers.map(p => p.id),
      coachId: this.currentUser.id
    };

    this.loading = true;
    this.trainingService.createTraining(trainingData).subscribe({
      next: (response) => {
        this.loading = false;
        alert('¡Entrenamiento programado exitosamente! Los jugadores recibirán una notificación.');
        
        // Reset form
        this.newTraining = {
          type: 'Entrenamiento Físico',
          date: '',
          time: '',
          duration: 90,
          description: ''
        };

        this.showWelcome();
      },
      error: (error) => {
        this.loading = false;
        console.error('Error creando entrenamiento:', error);
        alert('Error al programar el entrenamiento');
      }
    });
  }

  // Results methods
  setTrainingRating(rating: number) {
    this.trainingRating = rating;
  }

  getRatingColor(rating: number): string {
    const colors = [
      'bg-red-500 hover:bg-red-600',
      'bg-orange-500 hover:bg-orange-600', 
      'bg-yellow-500 hover:bg-yellow-600',
      'bg-green-500 hover:bg-green-600',
      'bg-blue-500 hover:bg-blue-600'
    ];
    return colors[rating - 1] || 'bg-gray-500 hover:bg-gray-600';
  }

  // Guardar resultados en BD
  saveTrainingResults() {
    const evaluations = this.teamPlayers.map(player => ({
      playerId: player.id,
      endurance: player.endurance,
      technique: player.technique,
      attitude: player.attitude
    }));

    const resultsData = {
      evaluations,
      notes: this.trainingNotes,
      rating: this.trainingRating,
      coachId: this.currentUser.id
    };

    this.loading = true;
    this.trainingService.saveTrainingResults(resultsData).subscribe({
      next: (response) => {
        this.loading = false;
        alert('Resultados del entrenamiento guardados correctamente');
        this.showWelcome();
      },
      error: (error) => {
        this.loading = false;
        console.error('Error guardando resultados:', error);
        alert('Error al guardar los resultados');
      }
    });
  }

  // Stats methods
  getRankColor(index: number): string {
    const colors = ['bg-yellow-500', 'bg-gray-400', 'bg-orange-400'];
    return colors[index] || 'bg-gray-300';
  }

  getRankIcon(index: number): string {
    const icons = ['🥇', '🥈', '🥉'];
    return icons[index] || '🏅';
  }

  // Auth methods
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}