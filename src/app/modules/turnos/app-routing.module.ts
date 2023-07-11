import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PerfilTurnoComponent } from './perfil-turno/perfil-turno.component';
import { SolicitarTurnoComponent } from './solicitar-turno/solicitar-turno.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MisTurnosComponent } from './mis-turnos/mis-turnos.component';
import { TurnosAdminComponent } from './turnos-admin/turnos-admin.component';


const routes: Routes = [{
  path:'',
  children: [
    { path: "perfil-turno", component: PerfilTurnoComponent},
    { path: "solicitar-turno", component: SolicitarTurnoComponent},
    { path: "mis-turnos", component: MisTurnosComponent},
    { path: "turnos-admin", component: TurnosAdminComponent},
    { path: "**", redirectTo: "perfil-turno"}
  ]
}];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
