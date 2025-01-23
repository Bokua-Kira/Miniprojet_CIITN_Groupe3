import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api'; // L'URL de ton backend Node.js

  constructor(private http: HttpClient) {}

  // Fonction pour récupérer le message de l'API
  getHelloMessage(): Observable<any> {
    return this.http.get(`${this.baseUrl}/hello`);
  }
}
