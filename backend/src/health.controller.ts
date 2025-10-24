import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  // Raíz: cuando vayan a la URL base
  @Get()
  root() {
    return {
      message: '¡Bienvenido a OrbitFit Backend!',
      status: 'OK',
      docs: '/health',  // Para ir al health
    };
  }

  // Health: para pruebas
  @Get('health')
  health() {
    return {
      status: 'OK',
      message: 'Backend vivo - SIN base de datos',
      timestamp: new Date().toISOString(),
    };
  }
}