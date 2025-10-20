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
recoveryStep: 'email' | 'code' | 'newPassword' = 'email';
recoveryCode = '';
newPassword = '';
temporalCode = '';

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
  if (this.recoveryStep === 'email') {
    if (this.recoveryEmail) {
      // Simular envío de código
      this.temporalCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      console.log('🔐 Código de recuperación (para desarrollo):', this.temporalCode);
      console.log('📧 Email ingresado:', this.recoveryEmail);
      
      this.recoveryStep = 'code';
      alert(`📧 Código enviado a ${this.recoveryEmail}\n\nPara desarrollo: Abre la consola del navegador (F12) y busca el código.`);
    } else {
      alert('Por favor ingresa tu email');
    }
  } else if (this.recoveryStep === 'code') {
    if (this.recoveryCode === this.temporalCode) {
      this.recoveryStep = 'newPassword';
    } else {
      alert('❌ Código incorrecto. Revisa la consola del navegador (F12).');
    }
  } else if (this.recoveryStep === 'newPassword') {
    if (this.newPassword && this.newPassword.length >= 6) {
      // Simular cambio de contraseña
      this.registerLoading = true;
      
      setTimeout(() => {
        this.registerLoading = false;
        alert('✅ Contraseña actualizada correctamente\n\nAhora puedes iniciar sesión con tu nueva contraseña.');
        this.resetRecovery();
        this.showLoginForm();
      }, 1500);
      
    } else {
      alert('La contraseña debe tener al menos 6 caracteres');
    }
  }
}

// AÑADE este método NUEVO:
resetRecovery() {
  this.recoveryStep = 'email';
  this.recoveryCode = '';
  this.newPassword = '';
  this.temporalCode = '';
  this.recoveryEmail = '';
  this.registerLoading = false;
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
  this.resetRecovery(); // Limpiar también recuperación
}
}