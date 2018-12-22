import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// se importan los servicios de environment
import { environment } from './../environments/environment';

// importacion del servicio
import { ServicioService } from './servicios/servicio.service';

// imprtacion de los modulos de firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    AngularFireAuthModule
  ],
  providers: [ServicioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
