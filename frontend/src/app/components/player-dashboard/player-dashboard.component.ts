import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { TrainingService } from '../../services/training.service';
import { ChatService } from '../../services/chat.service';

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
  selector: 'app-player-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-dashboard.component.html',
  styleUrls: ['./player-dashboard.component.scss']
})
export class PlayerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  userProfile: any = null;
  calendarVisible = false;
  chatVisible = false;
  currentView = 'welcome';
  loading = false;

  // Chat
  teamMembers: any[] = [];
  chatMessages: any[] = [];
  newMessage: string = '';

  // Calendario
  currentMonth: string = '';
  calendarDays: CalendarDay[] = [];
  selectedDate: Date = new Date();
  calendarEvents: { [key: string]: CalendarEvent[] } = {};
  nextEvent: any = null;

  // Datos del jugador
  playerStats = {
    matchesPlayed: 0,
    goals: 0,
    assists: 0,
    nextMatch: 'Por programar'
  };

  trainings: any[] = [];
  playerPerformance: any = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private trainingService: TrainingService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit() {
  this.currentUser = this.authService.getCurrentUser();
  if (!this.currentUser) {
    this.router.navigate(['/login']);
    return;
  }
  this.loadUserProfile();
  this.loadPlayerStats();
  this.loadPlayerTrainings();
  this.loadPlayerPerformance();
  this.generateCalendar();
}

  loadUserProfile() {
    this.loading = true;
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.loading = false;
        this.userProfile = this.currentUser;
      }
    });
  }

  loadPlayerStats() {
    this.trainingService.getTeamStats().subscribe({
      next: (stats) => {
        this.playerStats = {
          matchesPlayed: stats.matchesPlayed || 0,
          goals: 0,
          assists: 0,
          nextMatch: this.getNextEvent() || 'Por programar'
        };
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.playerStats = {
          matchesPlayed: 24,
          goals: 8,
          assists: 12,
          nextMatch: 'Sábado 15:00'
        };
      }
    });
  }

  // En el método loadPlayerTrainings
loadPlayerTrainings() {
  console.log('🔄 Cargando entrenamientos del jugador...');
  
  this.trainingService.getPlayerTrainings().subscribe({
    next: (trainings) => {
      console.log('✅ Entrenamientos recibidos del backend:', trainings);
      
      if (trainings.length === 0) {
        console.log('ℹ️ No se encontraron entrenamientos para este jugador');
      }

      this.trainings = trainings.map((training: any) => ({
        id: training.id,
        title: training.title,
        date: new Date(training.date),
        dateFormatted: this.formatTrainingDate(training.date),
        type: this.mapTrainingType(training.type),
        coach: `${training.coach?.firstName || 'Entrenador'} ${training.coach?.lastName || ''}`,
        status: this.getTrainingStatus(training.date),
        statusClass: this.getStatusClass(training.date),
        borderClass: this.getBorderClass(training.type),
        bgClass: this.getBgClass(training.type)
      }));

      console.log('📅 Entrenamientos procesados:', this.trainings);

      // Procesar para calendario
      this.processTrainingsForCalendar(trainings);
      this.updateNextEvent();
      this.generateCalendar();
    },
    error: (error) => {
      console.error('❌ Error cargando entrenamientos:', error);
      console.error('Detalles del error:', error.error);
      this.trainings = [];
    }
  });
}

  loadPlayerPerformance() {
  this.trainingService.getPlayerPerformance().subscribe({
    next: (performance) => {
      this.playerPerformance = performance;
    },
    error: (error) => {
      console.error('Error loading performance:', error);
      this.playerPerformance = null;
    }
  });
}

  calculatePlayerPerformance(results: any[]) {
    let totalEndurance = 0;
    let totalTechnique = 0;
    let totalAttitude = 0;
    let count = 0;

    results.forEach(result => {
      Object.keys(result.players).forEach(playerName => {
        if (playerName.includes(this.currentUser?.firstName || '') && 
            playerName.includes(this.currentUser?.lastName || '')) {
          const playerResult = result.players[playerName];
          totalEndurance += this.ratingToNumber(playerResult.endurance);
          totalTechnique += this.ratingToNumber(playerResult.technique);
          totalAttitude += this.ratingToNumber(playerResult.attitude);
          count++;
        }
      });
    });

    return count > 0 ? {
      endurance: totalEndurance / count,
      technique: totalTechnique / count,
      attitude: totalAttitude / count,
      overall: (totalEndurance + totalTechnique + totalAttitude) / (3 * count)
    } : null;
  }

  ratingToNumber(rating: string): number {
    const ratingMap: { [key: string]: number } = {
      'excellent': 5,
      'good': 4,
      'regular': 3,
      'needs_improvement': 2
    };
    return ratingMap[rating] || 3;
  }

  // Métodos del Chat
  loadTeamMembers() {
    this.chatService.getTeamMembers().subscribe({
      next: (members) => {
        this.teamMembers = members;
      },
      error: (error) => {
        console.error('Error cargando miembros del equipo:', error);
      }
    });
  }

  loadGeneralMessages() {
    this.chatService.getGeneralMessages().subscribe({
      next: (messages) => {
        this.chatMessages = messages;
      },
      error: (error) => {
        console.error('Error cargando mensajes generales:', error);
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.chatService.sendMessage(this.newMessage).subscribe({
      next: (message) => {
        this.chatMessages.push(message);
        this.newMessage = '';
        this.loadGeneralMessages();
      },
      error: (error) => {
        console.error('Error enviando mensaje:', error);
        alert('Error al enviar el mensaje');
      }
    });
  }

  toggleChat() {
    this.chatVisible = !this.chatVisible;
    if (this.chatVisible) {
      this.calendarVisible = false;
      this.loadGeneralMessages();
      this.loadTeamMembers();
    }
  }

  getAvatarInitials(member: any): string {
    return `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();
  }

  isOwnMessage(message: any): boolean {
    return message.sender.id === this.currentUser?.id;
  }

  // Métodos del Calendario
  toggleCalendar() {
    this.calendarVisible = !this.calendarVisible;
    if (this.calendarVisible) {
      this.chatVisible = false;
    }
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

  console.log('📅 Eventos del calendario procesados:', this.calendarEvents);
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
  }

  getNextEvent(): string {
    if (this.nextEvent) {
      const date = new Date(this.nextEvent.fullDate);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return 'Por programar';
  }

  // Métodos del calendario que faltaban
  selectDate(day: CalendarDay) {
    this.selectedDate = day.date;
    this.generateCalendar();
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

  // Helper methods
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatTrainingDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  mapTrainingType(backendType: string): string {
    const typeMap: { [key: string]: string } = {
      'FISICO': 'Entrenamiento Físico',
      'TACTICO': 'Práctica Táctica', 
      'TECNICO': 'Trabajo Técnico',
      'PRACTICA': 'Partido de Práctica'
    };
    return typeMap[backendType] || 'Entrenamiento';
  }

  getTrainingStatus(dateString: string): string {
    const trainingDate = new Date(dateString);
    const now = new Date();
    
    if (trainingDate < now) return 'Completado';
    if (trainingDate.toDateString() === now.toDateString()) return 'Hoy';
    return 'Programado';
  }

  getStatusClass(dateString: string): string {
    const status = this.getTrainingStatus(dateString);
    const classMap: { [key: string]: string } = {
      'Completado': 'bg-gray-500',
      'Hoy': 'bg-green-500',
      'Programado': 'bg-blue-500'
    };
    return classMap[status] || 'bg-gray-500';
  }

  getBorderClass(type: string): string {
    const classMap: { [key: string]: string } = {
      'FISICO': 'border-blue-500',
      'TACTICO': 'border-green-500',
      'TECNICO': 'border-yellow-500',
      'PRACTICA': 'border-red-500'
    };
    return classMap[type] || 'border-gray-500';
  }

  getBgClass(type: string): string {
    const classMap: { [key: string]: string } = {
      'FISICO': 'bg-blue-50',
      'TACTICO': 'bg-green-50',
      'TECNICO': 'bg-yellow-50',
      'PRACTICA': 'bg-red-50'
    };
    return classMap[type] || 'bg-gray-50';
  }

  formatMessageTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return '--:--';
    }
  }

  // Navigation methods
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  showPlayerProfile() {
    this.currentView = 'profile';
  }

  showTrainings() {
    this.currentView = 'trainings';
  }

  showPlayerStats() {
    this.currentView = 'stats';
  }

  showWelcome() {
    this.currentView = 'welcome';
  }

  updateProfile() {
    if (this.userProfile) {
      this.userService.updateProfile(this.userProfile).subscribe({
        next: (updatedProfile) => {
          this.userProfile = updatedProfile;
          alert('Perfil actualizado correctamente');
        },
        error: (error) => {
          alert('Error al actualizar perfil: ' + error.error?.message);
        }
      });
    }
  }
}