import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidosComponent } from './pages/bienvenidos/bienvenidos.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { NavBarComponent } from './componentes/nav-bar/nav-bar.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerificacionRegistroComponent } from './pages/verificacion-registro/verificacion-registro.component';
import { environment } from 'src/environments/environment';
import { MatFabMenuModule } from '@angular-material-extensions/fab-menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraficosComponent } from './graficos/graficos.component';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { ColorRandomDirective } from './directivas/color-random.directive';
import { ColorPorUsuarioDirective } from './directivas/color-por-usuario.directive';
import { TipoDeLetraDirective } from './directivas/tipo-de-letra.directive';
import { CaptchaDirective } from './directivas/captcha.directive';
import { CaptchaComponent } from './componentes/captcha/captcha.component';
import { UtilidadesModule } from './modules/utilidades/utilidades.module';

PdfMakeWrapper.setFonts(pdfFonts);

@NgModule({
  declarations: [
    AppComponent,
    BienvenidosComponent,
    LoginComponent,
    RegistroComponent,
    NavBarComponent,
    VerificacionRegistroComponent,
    GraficosComponent,
    ColorRandomDirective,
    ColorPorUsuarioDirective,
    TipoDeLetraDirective,
    CaptchaDirective
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    MatFabMenuModule,
    BrowserAnimationsModule,
    UtilidadesModule
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
