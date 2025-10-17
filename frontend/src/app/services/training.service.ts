import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Player {
  id: number;
  name: string;
  position: string;
}

export interface TeamStats {
  activePlayers: number;
  trainings: number;
  matchesPlayed: number;
  wins: number;
  topPlayers?: any[];
}

export interface Training {
  id?: number;
  title: string;
  description: string;
  type: string;
  date: string;
  duration: number;
  playerIds: number[];
  coachId: number;
}

export interface CalendarEvent {
  id?: number;
  title: string;
  time: string;
  type: string;
  description?: string;
  originalTraining?: any;
}

export interface PlayerResult {
  endurance: string;
  technique: string;
  attitude: string;
  observations: string;
}

export interface TrainingResults {
  trainingId: number;
  players: { [playerName: string]: PlayerResult };
  generalObservations: string;
  rating: number;
}

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  public apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // ✅ RUTAS CORREGIDAS - todas empiezan con /coach/
  createTraining(trainingData: Training): Observable<any> {
    return this.http.post(`${this.apiUrl}/coach/trainings`, trainingData, {
      headers: this.getHeaders()
    });
  }

  getCoachTrainings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/coach/trainings`, {
      headers: this.getHeaders()
    });
  }

  // ✅ CORREGIDO: usa /coach/trainings/ en lugar de /trainings/
  updateTraining(trainingId: number, trainingData: any): Observable<any> {
    console.log('🔄 Enviando PUT a:', `${this.apiUrl}/coach/trainings/${trainingId}`);
    return this.http.put(`${this.apiUrl}/coach/trainings/${trainingId}`, trainingData, {
      headers: this.getHeaders()
    });
  }

  // ✅ CORREGIDO: usa /coach/trainings/ en lugar de /trainings/
  deleteTraining(trainingId: number): Observable<any> {
    console.log('🗑️ Enviando DELETE a:', `${this.apiUrl}/coach/trainings/${trainingId}`);
    return this.http.delete(`${this.apiUrl}/coach/trainings/${trainingId}`, {
      headers: this.getHeaders()
    });
  }

  getTeamPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/coach/players`, {
      headers: this.getHeaders()
    });
  }

  getTeamStats(): Observable<TeamStats> {
    return this.http.get<TeamStats>(`${this.apiUrl}/coach/stats`, {
      headers: this.getHeaders()
    });
  }

  // ✅ MÉTODOS NUEVOS PARA RESULTADOS
  saveTrainingResults(results: TrainingResults): Observable<any> {
    return this.http.post(`${this.apiUrl}/coach/training-results`, results, {
      headers: this.getHeaders()
    });
  }

  updateTrainingResults(trainingId: number, results: TrainingResults): Observable<any> {
    return this.http.put(`${this.apiUrl}/coach/training-results/${trainingId}`, results, {
      headers: this.getHeaders()
    });
  }

  getTrainingResults(trainingId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/coach/training-results/${trainingId}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching training results:', error);
        return of(null);
      })
    );
  }

  getAllTrainingResults(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/coach/training-results`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching all training results:', error);
        return of([]);
      })
    );
  }

  deleteTrainingResults(trainingId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/coach/training-results/${trainingId}`, {
      headers: this.getHeaders()
    });
  }

  getPlayerTrainings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/player/trainings`, {
      headers: this.getHeaders()
    });
  }
}