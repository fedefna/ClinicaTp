import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidosComponent } from './pages/bienvenidos/bienvenidos.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { VerificacionRegistroComponent } from './pages/verificacion-registro/verificacion-registro.component';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { GraficosComponent } from './graficos/graficos.component';

const routes: Routes = [
  { path: 'bienvenidos', component: BienvenidosComponent, data: { animation: 'Inicio' } },
  { path: 'login', component: LoginComponent, data: { animation: 'Login' } },
  { path: 'registro', component: RegistroComponent, data: { animation: 'Registro' } },
  { path: 'verificacion-registro', component: VerificacionRegistroComponent },
  {
    path: "usuarios",
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () => import('./modules/usuarios/usuarios.module').then(m => m.UsuariosModule), 
    data: { animation: 'PanelUsuarios' }
  },
  {
    path: "graficos",
    canActivate: [AuthGuard, AdminGuard],
    component: GraficosComponent,  
    data: { animation: 'Estadisticas' }
  },
  { path: 'verificacion-registro', component: VerificacionRegistroComponent },
  {
    path: "turnos",
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/turnos/turnos.module').then(m => m.TurnosModule),  
    data: { animation: 'MisTurnos' }
  },
  { path: '', redirectTo: 'bienvenidos', pathMatch: 'full' },//Si esta vacio voy a home
  { path: '**', redirectTo: 'bienvenidos' }//Si es cualquier cosa, voy a home
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
