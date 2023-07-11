import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { GestionarEspecialistasComponent } from './gestionar-especialistas/gestionar-especialistas.component';
import { CrearUsuariosComponent } from './crear-usuarios/crear-usuarios.component';
import { UsuariosModuleRoutingModule } from './usuarios-module-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UsuariosComponent,
    GestionarEspecialistasComponent,
    CrearUsuariosComponent
  ],
  imports: [
    CommonModule,
    UsuariosModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsuariosModule { }
