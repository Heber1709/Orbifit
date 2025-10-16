import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  type: string;
  date: string;
  time: string;
  duration: number;
  description: string;
  coachId: number;
  players?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  
  createTraining(trainingData: Training): Observable<any> {
    return this.http.post(`${this.apiUrl}/trainings`, trainingData, {
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

  
  saveTrainingResults(results: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/trainings/results`, results, {
      headers: this.getHeaders()
    });
  }

  
  getPlayerTrainings(): Observable<Training[]> {
    return this.http.get<Training[]>(`${this.apiUrl}/player/trainings`, {
      headers: this.getHeaders()
    });
  }
}