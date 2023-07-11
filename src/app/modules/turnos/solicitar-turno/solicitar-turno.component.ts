import { Component, OnInit } from '@angular/core';
import { Hora } from 'src/app/Clases/hora';
import { Turno } from 'src/app/Clases/turno';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { User } from '../../../Clases/user';
import { TurnoService } from '../../../services/turno.service';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css']
})
export class SolicitarTurnoComponent implements OnInit {

  listaEspecialidades: string[] = ['ALERGIA E INMUNOLOGÍA', 'CARDIOLOGIA', 'CIRUGIA DE TORAX', 'CIRUGIA GENERAL', 'CIRUGIA PEDIATRICA', 'CIRUGIA PLASTICA Y REPARADORA', 'CLÍNICA DERMATOLÓGICA', 'DIABETOLOGÍA', 'EPIDEMIOLOGÍA', 'GASTROENTEROLOGíA', 'NEUMONOLOGÍA', 'OFTALMOLOGÍA', 'ONCOLOGÍA', 'ORTOPEDIA Y TRAUMATOLOGÍA', 'OTORRINOLARINGOLOGÍA', 'PATOLOGÍA', 'PEDIATRÍA', 'PSIQUIATRÍA', 'REUMATOLOGÍA', 'UROLOGÍA'];

  especialidadSeleccionada = '';
  captchaOkay: boolean = false;
  captchaUtilidades: boolean = false;
  errorCaptcha: boolean = false;
  listaEspecialistas: User[] = [];
  especialistaSeleccionado: User = new User;
  fechaActual: Date = new Date();
  fechaLimite: Date = new Date();
  fechaElegida: Date = new Date();
  turnosPosibles: Turno[] = [];
  dias = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sabado'];
  flagTurnoCreado = false;



  constructor(private usuarioService: UsuariosService, private turnoService: TurnoService, private utilidadesService: UtilidadesService) {
    this.fechaLimite.setDate(this.fechaActual.getDate() + 15);
    this.utilidadesService.traerTodasLasUtilidades().valueChanges().subscribe((data: any) => {

      data.forEach((utilidades: any) => {
        if (utilidades.captcha == true) {
          this.captchaUtilidades = true;
        } else {
          this.captchaUtilidades = false;
        }
      }
      )
    });
  }

  ngOnInit(): void {
  }

  seleccionarEspecialidad(especialidad: string) {
    this.filtrarEspecialistas(especialidad);
    this.especialidadSeleccionada = especialidad;
  }

  async mostrarTurnosPosibles(user: User) {
    this.especialistaSeleccionado = user
    this.turnosPosibles = [];
    this.especialistaSeleccionado.horariosMap.forEach((hora: Hora) => {
      //Creo posibles turnos para los lunes
      if (hora.lunes === this.especialidadSeleccionada) {
        this.generarArrayDeTurnosPosibles(user, hora, 1);
      }
      //Creo posibles turnos para los martes
      if (hora.martes === this.especialidadSeleccionada) {
        this.generarArrayDeTurnosPosibles(user, hora, 2);
      }
      //Creo posibles turnos para los miercoles
      if (hora.miercoles === this.especialidadSeleccionada) {
        this.generarArrayDeTurnosPosibles(user, hora, 3);
      }
      //Creo posibles turnos para los jueves
      if (hora.jueves === this.especialidadSeleccionada) {
        this.generarArrayDeTurnosPosibles(user, hora, 4);
      }
      //Creo posibles turnos para los viernes
      if (hora.viernes === this.especialidadSeleccionada) {
        this.generarArrayDeTurnosPosibles(user, hora, 5);
      }
      //Creo posibles turnos para los sabado
      if (hora.sabado === this.especialidadSeleccionada) {
        this.generarArrayDeTurnosPosibles(user, hora, 6);
      }
    });
    //ordernar turnos porr fecha
    this.turnosPosibles = this.turnosPosibles.sort((a: Turno, b: Turno) => {
      if (a.fecha > b.fecha) {
        return 1
      }

      if (a.fecha < b.fecha) {
        return -1
      }
      return 0
    });
    //filtrar turnos que estan ocupados
    await this.filtrarTurnosDelEspecialista(this.especialistaSeleccionado);
  }

  generarArrayDeTurnosPosibles(user: User, hora: Hora, dayId: number) {
    let fecha: Date = new Date();
    if (fecha.getDay() === dayId) {
      this.crearYpushearPosibleTurno(user, hora, fecha);
    }
    while (fecha.getDay() != dayId && fecha < this.fechaLimite) {
      fecha.setDate(fecha.getDate() + 1);
    }
    if (fecha.getDay() === dayId) {
      this.crearYpushearPosibleTurno(user, hora, fecha);
    }
    while (fecha.getDay() != dayId && fecha < this.fechaLimite) {
      fecha.setDate(fecha.getDate() + 1);
    }
    if (fecha.getDay() === dayId) {
      this.crearYpushearPosibleTurno(user, hora, fecha);
    }
  }

  crearYpushearPosibleTurno(user: User, hora: Hora, fecha: Date) {
    if (this.usuarioService.id && user.id && hora.hora) {
      let turno: Turno = new Turno(this.usuarioService.id, user.id, fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear(), hora.hora, this.especialidadSeleccionada, this.usuarioService.usuarioSeleccionado.nombre + ' ' + this.usuarioService.usuarioSeleccionado.apellido, user.nombre + ' ' + user.apellido);
      this.turnosPosibles.push(turno);
      fecha.setDate(fecha.getDate() + 1);
    }
  }

  filtrarEspecialistas(especialidad: string) {
    this.listaEspecialistas = [];
    this.usuarioService.obtenerUsuariosSegunEspecialidad(this.listaEspecialistas, especialidad);
  }

  async crearTurno(turno: Turno) {
    await this.turnoService.crearTurno(turno);
    this.turnosPosibles = [];
    this.especialidadSeleccionada = '';
    this.listaEspecialistas = [];
    this.especialistaSeleccionado = new User;
    this.fechaActual = new Date();
    this.fechaLimite.setDate(this.fechaActual.getDate() + 15);
    this.fechaElegida = new Date();
    this.turnosPosibles = [];
    this.captchaOkay= false;
    console.log('Turno Creado')
  }

  async filtrarTurnosDelEspecialista(especialista: User) {
    if (especialista.id) {
      await this.turnoService.obtenerTurnosDelEspecialista(especialista.id);
    }

    this.turnoService.listaDeTurnosPorEspecialista.forEach(turno => {
      if (turno.estado != 'cancelado' && turno.estado != 'realizado' && turno.estado != 'rechazado' && turno.estado != 'finalizado') {
        for (let i = 0; i < this.turnosPosibles.length; i++) {
          const turnoPos = this.turnosPosibles[i];
          if (turnoPos.fecha === turno.fecha && turnoPos.hora === turno.hora) {
            this.turnosPosibles.splice(i, 1);
          }
        }
      }
    });

  }

  verificarResultadoCaptcha(resultado: boolean) {
    this.captchaOkay = resultado;
  }

}
