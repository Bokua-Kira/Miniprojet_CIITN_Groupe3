import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Importez le composant nouvellement créé

const routes: Routes = [
  { path: '', component: HomeComponent } // Utilisez HomeComponent ici
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent // Déclarez le nouveau composant
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes) // Configurez RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
