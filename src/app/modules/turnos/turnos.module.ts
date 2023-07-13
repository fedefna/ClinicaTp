import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisTurnosComponent } from './mis-turnos/mis-turnos.component';
import { TurnosAdminComponent } from './turnos-admin/turnos-admin.component';
import { SolicitarTurnoComponent } from './solicitar-turno/solicitar-turno.component';
import { PerfilTurnoComponent } from './perfil-turno/perfil-turno.component';
import { AppRoutingModule } from 'src/app/modules/turnos/app-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoriaClinicaComponent } from './historia-clinica/historia-clinica.component';
import { CaptchaComponent } from 'src/app/componentes/captcha/captcha.component';
import { AppModule } from 'src/app/app.module';
import { UtilidadesModule } from '../utilidades/utilidades.module';
import { PacientesComponent } from './pacientes/pacientes.component';


@NgModule({
  declarations: [
    MisTurnosComponent,
    TurnosAdminComponent,
    SolicitarTurnoComponent,
    PerfilTurnoComponent,
    HistoriaClinicaComponent,
    PacientesComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    UtilidadesModule
  ]
})
export class TurnosModule { }
