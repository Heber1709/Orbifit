import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

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

  // Datos iniciales
  playerStats = {
    matchesPlayed: 0,
    goals: 0,
    assists: 0,
    nextMatch: 'Por programar'
  };

  trainings: any[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
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
        // Usar datos del currentUser como fallback
        this.userProfile = this.currentUser;
      }
    });
  }

  loadPlayerStats() {
    // Por ahora datos de ejemplo, luego conectar con backend
    this.playerStats = {
      matchesPlayed: 24,
      goals: 8,
      assists: 12,
      nextMatch: 'Sábado 15:00'
    };
  }

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

  toggleCalendar() {
    this.calendarVisible = !this.calendarVisible;
    if (this.calendarVisible) this.chatVisible = false;
  }

  toggleChat() {
    this.chatVisible = !this.chatVisible;
    if (this.chatVisible) this.calendarVisible = false;
  }

  simulateCoachCreatedTrainings() {
    this.trainings = [
      {
        title: 'Entrenamiento Físico',
        date: 'Lunes, 18 de Diciembre - 16:00',
        coach: 'Carlos Martínez',
        status: 'Confirmado',
        statusClass: 'bg-blue-500',
        borderClass: 'border-blue-500',
        bgClass: 'bg-blue-50'
      },
      {
        title: 'Práctica Táctica', 
        date: 'Miércoles, 20 de Diciembre - 17:30',
        coach: 'Ana López',
        status: 'Pendiente',
        statusClass: 'bg-green-500',
        borderClass: 'border-green-500',
        bgClass: 'bg-green-50'
      }
    ];
    this.currentView = 'trainings';
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