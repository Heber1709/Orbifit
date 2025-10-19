import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  showRegister = false;
  showRecovery = false;
  loading = false;
  registerLoading = false;

  // Datos del login (solo email y contraseña)
  email = '';
  password = '';

  // Datos del registro
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    position: 'Mediocampo',
    username: '',
    password: '',
    phone: '',
    jerseyNumber: ''
  };

  // Datos de recuperación
  recoveryEmail = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    if (this.email && this.password) {
      this.loading = true;
      
      this.authService.login(this.email, this.password).subscribe({
        next: (response) => {
          this.loading = false;
          this.redirectToDashboard(response.user.role);
        },
        error: (error) => {
          this.loading = false;
          alert('Error de login: ' + (error.error?.message || 'Credenciales incorrectas'));
        }
      });
    } else {
      alert('Por favor completa email y contraseña');
    }
  }

  onRegister() {
    if (this.registerData.firstName && this.registerData.lastName && 
        this.registerData.email && this.registerData.age && 
        this.registerData.username && this.registerData.password) {
      
      this.registerLoading = true;

      const registerData = {
        email: this.registerData.email,
        username: this.registerData.username,
        password: this.registerData.password,
        firstName: this.registerData.firstName,
        lastName: this.registerData.lastName,
        age: parseInt(this.registerData.age),
        position: this.registerData.position.toUpperCase().replace(' ', '_'),
        phone: this.registerData.phone,
        jerseyNumber: this.registerData.jerseyNumber ? parseInt(this.registerData.jerseyNumber) : undefined
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.registerLoading = false;
          alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
          this.showLoginForm();
        },
        error: (error) => {
          this.registerLoading = false;
          alert('Error en el registro: ' + (error.error?.message || 'Error del servidor'));
        }
      });
    } else {
      alert('Por favor completa todos los campos obligatorios');
    }
  }

  onRecovery() {
    if (this.recoveryEmail) {
      alert('Se ha enviado un enlace de recuperación a: ' + this.recoveryEmail);
      this.showLoginForm();
    } else {
      alert('Por favor ingresa tu email');
    }
  }

  private redirectToDashboard(role: string) {
  console.log('🎯 Redirigiendo al dashboard. Rol:', role);
  
  switch (role) {
    case 'JUGADOR':
      console.log('➡️ Redirigiendo a /player');
      this.router.navigate(['/player']);
      break;
    case 'ENTRENADOR':
      console.log('➡️ Redirigiendo a /coach');
      this.router.navigate(['/coach']);
      break;
    case 'ADMINISTRADOR':
      console.log('➡️ Redirigiendo a /admin');
      this.router.navigate(['/admin']);
      break;
    default:
      console.warn('⚠️ Rol desconocido:', role);
      this.router.navigate(['/']);
  }
  
  console.log('✅ Redirección completada');
}

  showRegisterForm() {
    this.showRegister = true;
    this.showRecovery = false;
    // Resetear datos del registro
    this.registerData = {
      firstName: '',
      lastName: '',
      email: '',
      age: '',
      position: 'Mediocampo',
      username: '',
      password: '',
      phone: '',
      jerseyNumber: ''
    };
  }

  showRecoveryForm() {
    this.showRecovery = true;
    this.showRegister = false;
    this.recoveryEmail = '';
  }

  showLoginForm() {
    this.showRegister = false;
    this.showRecovery = false;
    // Resetear datos del login
    this.email = '';
    this.password = '';
    this.loading = false;
    this.registerLoading = false;
  }
}