import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';  // Importation du service

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  message: string = '';
  title = 'Votre titre ici';
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // Appelle le service pour récupérer les données de l'API
    this.apiService.getHelloMessage().subscribe((data) => {
      this.message = data.message;  // Stocke la réponse de l'API
    });
  }
}
