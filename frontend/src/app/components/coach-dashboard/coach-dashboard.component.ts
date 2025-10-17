import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TrainingService, TrainingResults, PlayerResult } from '../../services/training.service';

// Tipos e interfaces
type ViewType = 'welcome' | 'profile' | 'schedule' | 'record' | 'teamstats';

interface CoachProfile {
  fullName: string;
  email: string;
  specialization: string;  
  experienceYears: number; 
  license: string;
  phone: string;
}

interface TrainingForm {
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
  jerseyNumber?: number;
  age?: number;
  selected: boolean;
}

interface TeamStats {
  activePlayers: number;
  trainings: number;
  matchesPlayed: number;
  wins: number;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

interface CalendarEvent {
  id?: number;
  title: string;
  time: string;
  type: string;
  description?: string;
  originalTraining?: any;
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
  currentView: ViewType = 'welcome';
  loading: boolean = false;
  
  calendarVisible: boolean = false;
  chatVisible: boolean = false;
  
  currentMonth: string = '';
  calendarDays: CalendarDay[] = [];
  selectedDate: Date = new Date();
  
  coachProfile: CoachProfile = {
    fullName: '',
    email: '',
    specialization: '',
    experienceYears: 0,
    license: '',
    phone: ''
  };

  newTraining: TrainingForm = {
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

  allPlayersSelected: boolean = true;

  calendarEvents: { [key: string]: CalendarEvent[] } = {};
  editingTrainingId: number | null = null;
  isEditMode: boolean = false;

  // Propiedades para registrar resultados
  selectedTrainingForResults: any = null;
  trainingResults: TrainingResults = {
    trainingId: 0,
    players: {},
    generalObservations: '',
    rating: 0
  };
  availableTrainings: any[] = [];
  savedResults: any[] = [];
  showSavedResults: boolean = false;

  // Propiedad para próximo evento
  nextEvent: any = null;

  constructor(
    private authService: AuthService,
    public trainingService: TrainingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadUserProfile();
    this.loadTeamPlayers();
    this.loadTeamStats();
    this.generateCalendar();
    this.loadTrainingsFromDatabase();
    this.loadSavedResults();
    this.updateNextEvent();
  }

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

  loadTeamPlayers() {
    this.loading = true;
    this.trainingService.getTeamPlayers().subscribe({
      next: (players) => {
        this.teamPlayers = players.map((player: any) => ({
          ...player,
          selected: true
        }));
        this.allPlayersSelected = true;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando jugadores:', error);
        this.loading = false;
      }
    });
  }

  loadTeamStats() {
    this.trainingService.getTeamStats().subscribe({
      next: (stats) => {
        this.teamStats = stats;
      },
      error: (error) => {
        console.error('Error cargando estadísticas:', error);
      }
    });
  }

  loadTrainingsFromDatabase() {
    this.loading = true;
    console.log('📅 Cargando entrenamientos reales desde la BD...');
    
    this.trainingService.getCoachTrainings().subscribe({
      next: (trainings: any[]) => {
        console.log('✅ Entrenamientos cargados:', trainings);
        this.processTrainingsForCalendar(trainings);
        this.loading = false;
        this.generateCalendar();
        this.updateNextEvent();
      },
      error: (error) => {
        console.error('❌ Error cargando entrenamientos:', error);
        this.loading = false;
        this.generateCalendar();
      }
    });
  }

  processTrainingsForCalendar(trainings: any[]) {
    this.calendarEvents = {};

    trainings.forEach(training => {
      const trainingDate = new Date(training.date);
      const dateStr = this.formatDate(trainingDate);
      const timeStr = trainingDate.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      const calendarEvent: CalendarEvent = {
        id: training.id,
        title: training.title,
        time: timeStr,
        type: training.type,
        description: training.description,
        originalTraining: training
      };

      if (!this.calendarEvents[dateStr]) {
        this.calendarEvents[dateStr] = [];
      }

      this.calendarEvents[dateStr].push(calendarEvent);
    });

    console.log('📊 Eventos del calendario procesados:', this.calendarEvents);
  }

  updateNextEvent() {
    const now = new Date();
    let nextEvent: any = null;

    Object.keys(this.calendarEvents).forEach(dateStr => {
      const events = this.calendarEvents[dateStr];
      events.forEach(event => {
        const eventDate = new Date(dateStr + 'T' + event.time);
        if (eventDate >= now) {
          if (!nextEvent || eventDate < new Date(nextEvent.date + 'T' + nextEvent.time)) {
            nextEvent = {
              ...event,
              date: dateStr,
              fullDate: eventDate
            };
          }
        }
      });
    });

    this.nextEvent = nextEvent;
    console.log('📅 Próximo evento:', this.nextEvent);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  showWelcome() {
    this.currentView = 'welcome';
    this.isEditMode = false;
    this.editingTrainingId = null;
    this.resetTrainingForm();
  }

  showCoachProfile() {
    this.currentView = 'profile';
  }

  showScheduleTraining() {
    this.currentView = 'schedule';
  }

  showRecordResults() {
    this.currentView = 'record';
    this.loadAvailableTrainings();
    this.loadSavedResults();
  }

  showTeamStats() {
    this.currentView = 'teamstats';
  }

  toggleCalendar() {
    this.calendarVisible = !this.calendarVisible;
    if (this.calendarVisible) {
      this.chatVisible = false;
      this.loadTrainingsFromDatabase();
    }
  }

  toggleChat() {
    this.chatVisible = !this.chatVisible;
    if (this.chatVisible) this.calendarVisible = false;
  }

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

  getSelectedPlayersCount(): number {
    return this.teamPlayers.filter(player => player.selected).length;
  }

  toggleSelectAll(select: boolean) {
    this.allPlayersSelected = select;
    this.teamPlayers.forEach(player => player.selected = select);
  }

  createTraining() {
    const selectedPlayers = this.teamPlayers
      .filter(player => player.selected)
      .map(player => player.id);
    
    if (!this.newTraining.date || !this.newTraining.time) {
      alert('Por favor completa la fecha y hora del entrenamiento');
      return;
    }

    if (selectedPlayers.length === 0) {
      alert('Selecciona al menos un jugador para el entrenamiento');
      return;
    }

    const trainingData = {
      title: `${this.newTraining.type} - ${this.newTraining.date}`,
      description: this.newTraining.description,
      type: this.mapTrainingType(this.newTraining.type),
      date: new Date(`${this.newTraining.date}T${this.newTraining.time}`).toISOString(),
      duration: parseInt(this.newTraining.duration.toString()),
      playerIds: selectedPlayers,
      coachId: this.currentUser.id
    };

    this.loading = true;

    if (this.isEditMode && this.editingTrainingId) {
      this.trainingService.updateTraining(this.editingTrainingId, trainingData).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('✅ Entrenamiento actualizado:', response);
          this.loadTrainingsFromDatabase();
          alert('¡Entrenamiento actualizado exitosamente!');
          this.showWelcome();
        },
        error: (error) => {
          this.loading = false;
          console.error('❌ Error actualizando entrenamiento:', error);
          alert('Error al actualizar el entrenamiento: ' + error.message);
        }
      });
    } else {
      this.trainingService.createTraining(trainingData).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('✅ Entrenamiento creado:', response);
          this.loadTrainingsFromDatabase();
          alert('¡Entrenamiento programado exitosamente!');
          this.showWelcome();
        },
        error: (error) => {
          this.loading = false;
          console.error('❌ Error creando entrenamiento:', error);
          alert('Error al programar el entrenamiento: ' + error.message);
        }
      });
    }
  }

  addTrainingToCalendar(training: any) {
    const trainingDate = new Date(training.date);
    const dateStr = this.formatDate(trainingDate);
    const timeStr = trainingDate.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const calendarEvent: CalendarEvent = {
      id: training.id,
      title: training.title,
      time: timeStr,
      type: training.type,
      description: training.description
    };

    if (!this.calendarEvents[dateStr]) {
      this.calendarEvents[dateStr] = [];
    }

    this.calendarEvents[dateStr].push(calendarEvent);
    this.generateCalendar();
    this.updateNextEvent();
  }

  private mapTrainingType(frontendType: string): string {
    const typeMap: { [key: string]: string } = {
      'Entrenamiento Físico': 'FISICO',
      'Práctica Táctica': 'TACTICO', 
      'Trabajo Técnico': 'TECNICO',
      'Partido de Práctica': 'PRACTICA'
    };
    return typeMap[frontendType] || 'FISICO';
  }

  editTraining(event: any, index: number) {
    console.log('✏️ Editando entrenamiento:', event);
    
    if (event.originalTraining) {
      this.loadTrainingForEdit(event.originalTraining);
    }
  }

  loadTrainingForEdit(training: any) {
    this.isEditMode = true;
    this.editingTrainingId = training.id;
    
    const trainingDate = new Date(training.date);
    
    this.newTraining = {
      type: this.reverseMapTrainingType(training.type),
      date: trainingDate.toISOString().split('T')[0],
      time: trainingDate.toTimeString().slice(0, 5),
      duration: training.duration,
      description: training.description || ''
    };

    this.teamPlayers.forEach(player => player.selected = true);
    
    this.showScheduleTraining();
  }

  reverseMapTrainingType(backendType: string): string {
    const typeMap: { [key: string]: string } = {
      'FISICO': 'Entrenamiento Físico',
      'TACTICO': 'Práctica Táctica', 
      'TECNICO': 'Trabajo Técnico',
      'PRACTICA': 'Partido de Práctica'
    };
    return typeMap[backendType] || 'Entrenamiento Físico';
  }

  deleteTraining(event: any, index: number) {
    console.log('🗑️ Eliminando entrenamiento:', event);
    
    if (confirm(`¿Eliminar "${event.title}"?`)) {
      if (event.id) {
        this.loading = true;
        this.trainingService.deleteTraining(event.id).subscribe({
          next: (response) => {
            this.loading = false;
            this.loadTrainingsFromDatabase();
            alert('✅ Eliminado correctamente');
          },
          error: (error) => {
            this.loading = false;
            console.error('❌ Error eliminando:', error);
            alert('Error al eliminar');
          }
        });
      }
    }
  }

  removeTrainingFromCalendar(event: CalendarEvent, index: number) {
    if (!this.selectedDate) return;
    
    const dateStr = this.formatDate(this.selectedDate);
    if (this.calendarEvents[dateStr]) {
      this.calendarEvents[dateStr].splice(index, 1);
      
      if (this.calendarEvents[dateStr].length === 0) {
        delete this.calendarEvents[dateStr];
      }
      
      this.generateCalendar();
      this.updateNextEvent();
    }
  }

  resetTrainingForm() {
    this.newTraining = {
      type: 'Entrenamiento Físico',
      date: '',
      time: '',
      duration: 90,
      description: ''
    };
    this.isEditMode = false;
    this.editingTrainingId = null;
  }

  generateCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    this.currentMonth = new Date(year, month, 1).toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    this.calendarDays = [];
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      this.calendarDays.push({
        date: date,
        isCurrentMonth: date.getMonth() === month,
        isToday: this.isToday(date),
        isSelected: this.selectedDate && this.isSameDay(date, this.selectedDate)
      });
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDay(date, today);
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  getDayClass(day: CalendarDay): string {
    let classes = 'calendar-day ';
    
    if (!day.isCurrentMonth) {
      classes += 'other-month ';
    } else if (day.isToday) {
      classes += 'today ';
    } else if (day.isSelected) {
      classes += 'selected ';
    }
    
    return classes;
  }

  getEventDotClass(date: Date): string {
    const events = this.getEventsForDate(date);
    if (events.length > 0) {
      const eventType = events[0].type;
      return this.mapEventTypeToClass(eventType);
    }
    return '';
  }

  mapEventTypeToClass(eventType: string): string {
    const typeMap: { [key: string]: string } = {
      'FISICO': 'training',
      'TACTICO': 'meeting',
      'TECNICO': 'training',
      'PRACTICA': 'match'
    };
    return typeMap[eventType] || 'training';
  }

  getEventItemClass(eventType: string): string {
    const classMap: { [key: string]: string } = {
      'FISICO': 'event-training',
      'TACTICO': 'event-meeting',
      'TECNICO': 'event-training',
      'PRACTICA': 'event-match'
    };
    return classMap[eventType] || 'event-training';
  }

  selectDate(day: CalendarDay) {
    this.selectedDate = day.date;
    this.generateCalendar();
  }

  hasEvent(date: Date): boolean {
    const dateStr = this.formatDate(date);
    return this.calendarEvents[dateStr] && this.calendarEvents[dateStr].length > 0;
  }

  getEventsForDate(date: Date): CalendarEvent[] {
    const dateStr = this.formatDate(date);
    return this.calendarEvents[dateStr] || [];
  }

  getDayEvents(): CalendarEvent[] {
    if (!this.selectedDate) return [];
    return this.getEventsForDate(this.selectedDate);
  }

  previousMonth() {
    const current = new Date(this.calendarDays[15].date);
    current.setMonth(current.getMonth() - 1);
    this.generateSpecificCalendar(current.getFullYear(), current.getMonth());
  }

  nextMonth() {
    const current = new Date(this.calendarDays[15].date);
    current.setMonth(current.getMonth() + 1);
    this.generateSpecificCalendar(current.getFullYear(), current.getMonth());
  }

  generateSpecificCalendar(year: number, month: number) {
    this.currentMonth = new Date(year, month, 1).toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    this.calendarDays = [];
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      this.calendarDays.push({
        date: date,
        isCurrentMonth: date.getMonth() === month,
        isToday: this.isToday(date),
        isSelected: this.selectedDate && this.isSameDay(date, this.selectedDate)
      });
    }
  }

  // MÉTODOS PARA REGISTRAR RESULTADOS
  loadAvailableTrainings() {
    this.loading = true;
    this.trainingService.getCoachTrainings().subscribe({
      next: (trainings) => {
        this.availableTrainings = trainings;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando entrenamientos:', error);
        this.loading = false;
      }
    });
  }

  loadSavedResults() {
    this.trainingService.getAllTrainingResults().subscribe({
      next: (results) => {
        console.log('📋 Resultados recibidos del backend:', results);
        this.savedResults = results;
      },
      error: (error) => {
        console.error('Error cargando resultados guardados:', error);
        this.savedResults = [];
      }
    });
  }

  showSavedResultsList() {
    this.showSavedResults = true;
  }

  hideSavedResultsList() {
    this.showSavedResults = false;
  }

  selectTrainingForResults(training: any) {
    this.selectedTrainingForResults = training;
    this.trainingResults.trainingId = training.id;
    
    this.loadExistingResults(training.id);
    this.initializePlayerResults(training);
  }

  loadExistingResults(trainingId: number) {
    this.trainingService.getTrainingResults(trainingId).subscribe({
      next: (results) => {
        if (results && results.playerResults) {
          this.trainingResults.generalObservations = results.generalObservations || '';
          this.trainingResults.rating = results.rating || 0;
          
          results.playerResults.forEach((playerResult: any) => {
            const playerName = `${playerResult.player.firstName} ${playerResult.player.lastName}`;
            this.trainingResults.players[playerName] = {
              endurance: playerResult.endurance || 'good',
              technique: playerResult.technique || 'good',
              attitude: playerResult.attitude || 'good',
              observations: playerResult.observations || ''
            };
          });
        }
      },
      error: (error) => {
        console.log('No hay resultados previos o error cargando:', error);
      }
    });
  }

  initializePlayerResults(training: any) {
    this.trainingResults.players = {};

    if (training.participants && training.participants.length > 0) {
      training.participants.forEach((participant: any) => {
        const playerName = `${participant.player.firstName} ${participant.player.lastName}`;
        this.trainingResults.players[playerName] = {
          endurance: 'good',
          technique: 'good', 
          attitude: 'good',
          observations: ''
        };
      });
    }
  }

  setPlayerRating(playerName: string, category: keyof PlayerResult, value: string) {
    if (!this.trainingResults.players[playerName]) {
      this.trainingResults.players[playerName] = {
        endurance: 'good',
        technique: 'good',
        attitude: 'good',
        observations: ''
      };
    }
    this.trainingResults.players[playerName][category] = value;
  }

  setTrainingRating(rating: number) {
    this.trainingResults.rating = rating;
  }

  saveTrainingResults() {
    if (!this.selectedTrainingForResults) {
      alert('Por favor selecciona un entrenamiento primero');
      return;
    }

    this.loading = true;
    this.trainingService.saveTrainingResults(this.trainingResults).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('✅ Resultados guardados:', response);
        alert('¡Resultados guardados exitosamente!');
        this.loadSavedResults();
        this.showWelcome();
      },
      error: (error) => {
        this.loading = false;
        console.error('❌ Error guardando resultados:', error);
        alert('Error al guardar los resultados: ' + error.message);
      }
    });
  }

  updateTrainingResults() {
    if (!this.selectedTrainingForResults) {
      alert('Por favor selecciona un entrenamiento primero');
      return;
    }

    this.loading = true;
    this.trainingService.updateTrainingResults(this.trainingResults.trainingId, this.trainingResults).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('✅ Resultados actualizados:', response);
        alert('¡Resultados actualizados exitosamente!');
        this.loadSavedResults();
        this.showWelcome();
      },
      error: (error) => {
        this.loading = false;
        console.error('❌ Error actualizando resultados:', error);
        alert('Error al actualizar los resultados: ' + error.message);
      }
    });
  }

  deleteTrainingResults(trainingId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar estos resultados? Esta acción no se puede deshacer.')) {
      this.loading = true;
      this.trainingService.deleteTrainingResults(trainingId).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('✅ Resultados eliminados:', response);
          
          this.savedResults = this.savedResults.filter(result => result.trainingId !== trainingId);
          
          if (this.trainingResults.trainingId === trainingId) {
            this.clearResultsForm();
          }
          
          alert('¡Resultados eliminados exitosamente!');
        },
        error: (error) => {
          this.loading = false;
          console.error('❌ Error eliminando resultados:', error);
          alert('Error al eliminar los resultados: ' + error.message);
        }
      });
    }
  }

  editSavedResults(result: any) {
    const training = this.availableTrainings.find(t => t.id === result.trainingId);
    if (training) {
      this.selectTrainingForResults(training);
      this.hideSavedResultsList();
    } else {
      alert('No se encontró el entrenamiento asociado a estos resultados');
    }
  }

  clearResultsForm() {
    this.selectedTrainingForResults = null;
    this.trainingResults = {
      trainingId: 0,
      players: {},
      generalObservations: '',
      rating: 0
    };
    this.showSavedResults = false;
  }

  // MÉTODOS AUXILIARES PARA EL TEMPLATE
  getPlayerNames(): string[] {
    return Object.keys(this.trainingResults.players);
  }

  getPlayerPosition(playerName: string): string {
    const player = this.teamPlayers.find(p => p.name === playerName);
    return player?.position || 'Sin posición';
  }

  getRatingButtonClass(rating: number): string {
    if (rating <= this.trainingResults.rating) {
      const colorClasses = {
        1: 'bg-red-500 hover:bg-red-600',
        2: 'bg-orange-500 hover:bg-orange-600', 
        3: 'bg-yellow-500 hover:bg-yellow-600',
        4: 'bg-green-500 hover:bg-green-600',
        5: 'bg-blue-500 hover:bg-blue-600'
      };
      return colorClasses[rating as keyof typeof colorClasses] || 'bg-gray-500';
    }
    return 'bg-gray-300 text-gray-600 hover:bg-gray-400';
  }

  onPlayerRatingChange(playerName: string, category: keyof PlayerResult, event: Event) {
    const target = event.target as HTMLSelectElement;
    this.setPlayerRating(playerName, category, target.value);
  }

  onPlayerObservationsChange(playerName: string, event: Event) {
    const target = event.target as HTMLTextAreaElement;
    if (!this.trainingResults.players[playerName]) {
      this.trainingResults.players[playerName] = {
        endurance: 'good',
        technique: 'good',
        attitude: 'good',
        observations: ''
      };
    }
    this.trainingResults.players[playerName].observations = target.value;
  }

  hasExistingResults(): boolean {
    return this.savedResults.some(result => result.trainingId === this.trainingResults.trainingId);
  }

  getTrainingTitle(trainingId: number): string {
    const training = this.availableTrainings.find(t => t.id === trainingId);
    return training?.title || `Entrenamiento #${trainingId}`;
  }

  formatEventDate(dateStr: string, timeStr: string): string {
    const date = new Date(dateStr + 'T' + timeStr);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}