import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Hora } from 'src/app/Clases/hora';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-perfil-turno',
  templateUrl: './perfil-turno.component.html',
  styleUrls: ['./perfil-turno.component.css']
})
export class PerfilTurnoComponent implements OnInit {

  nombre?: string = "";
  apellido?: string = "";
  fechaNaciemiento?: string = "";
  dni?: number = 321;
  obraSocial?: string = "";
  email?: string = "";
  imagenesPaciente1?: string = "";
  imagenesPaciente2?: string = "";
  tipoUsuario?: string = "";
  especialidades?: string[];
  imagenEspecialista?: string = "";
  id: string = "";
  horario?: any;
  especialidadSeleccionada = "Libre";
  flagEditar = false;

  constructor(private usuarioService: UsuariosService) {
    this.nombre = this.usuarioService.usuarioSeleccionado?.nombre;
    this.apellido = this.usuarioService.usuarioSeleccionado?.apellido;
    this.fechaNaciemiento = this.usuarioService.usuarioSeleccionado?.fechaNaciemiento;
    this.dni = this.usuarioService.usuarioSeleccionado.dni;
    this.email = this.usuarioService.usuarioSeleccionado.email;
    this.tipoUsuario = this.usuarioService.usuarioSeleccionado.role;

    if (this.tipoUsuario === 'paciente') {
      this.obraSocial = this.usuarioService.usuarioSeleccionado.obraSocial;
      this.imagenesPaciente1 = this.usuarioService.usuarioSeleccionado.imagenesPaciente1;
      this.imagenesPaciente2 = this.usuarioService.usuarioSeleccionado.imagenesPaciente2;
    } else if (this.tipoUsuario === 'especialista') {
      this.especialidades = this.usuarioService.usuarioSeleccionado.especialidades;
      this.horario = <Hora><unknown>Object.values(this.usuarioService.usuarioSeleccionado.horariosMap);
      console.log(this.horario);
      if (this.usuarioService.usuarioSeleccionado.imagenEspecialista) {
        this.imagenEspecialista = this.usuarioService.usuarioSeleccionado.imagenEspecialista;
      } else if (this.usuarioService.usuarioSeleccionado.imagenEspecialista) {
        this.imagenEspecialista = this.usuarioService.usuarioSeleccionado.imagenEspecialista;
      }
    }
  }

  ngOnInit(): void {
  }

  seleccionarEspecialidad(especialidad: string) {
    this.especialidadSeleccionada = especialidad;
  }

  cambiarHorario(dia: string, hora: Hora) {
    if (this.flagEditar) {
      switch (dia) {
        case 'lunes':
          hora.lunes = this.especialidadSeleccionada;
          break;
        case 'martes':
          hora.martes = this.especialidadSeleccionada;
          break;
        case 'miercoles':
          hora.miercoles = this.especialidadSeleccionada;
          break;
        case 'jueves':
          hora.jueves = this.especialidadSeleccionada;
          break;
        case 'viernes':
          hora.viernes = this.especialidadSeleccionada;
          break;
        case 'sabado':
          if (hora.hora === '15' || hora.hora === '16' || hora.hora === '17' || hora.hora === '18' || hora.hora === '19') {
            console.log("La hora seleccionada esta en horario de cierre");
          } else {
            hora.sabado = this.especialidadSeleccionada;
          }
          break;
        default:
          break;
      }
    }else{
      console.log("apreta el boton editar primero!")
    }
  }

  async guardarCambios() {
    if (this.email != undefined) {
      await this.usuarioService.obtenerID(this.email);
    }
    if (this.usuarioService.id != undefined) {
      await this.usuarioService.update(this.usuarioService.id, { horariosMap: this.horario });
      this.flagEditar=false;
    }
  }
  
  editarHorarios() {
    this.flagEditar=true;  
  }

}
