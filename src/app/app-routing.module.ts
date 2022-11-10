import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidosComponent } from './pages/bienvenidos/bienvenidos.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { VerificacionRegistroComponent } from './pages/verificacion-registro/verificacion-registro.component';

const routes: Routes = [
  {path: 'bienvenidos', component: BienvenidosComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'verificacion-registro', component: VerificacionRegistroComponent},
  {path: '', redirectTo: 'bienvenidos', pathMatch: 'full'},//Si esta vacio voy a home
  {path: '**', redirectTo: 'bienvenidos'}//Si es cualquier cosa, voy a home
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
