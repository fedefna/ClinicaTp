import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { User } from 'src/app/Clases/user';
import { TurnoService } from 'src/app/services/turno.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Turno } from '../../../Clases/turno';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { filter, map, Observable } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent implements OnInit {

  // turnos$: Observable<Turno[]>;
  listaEspecialidades: string[] = ['ALERGIA E INMUNOLOGÍA', 'CARDIOLOGIA', 'CIRUGIA DE TORAX', 'CIRUGIA GENERAL', 'CIRUGIA PEDIATRICA', 'CIRUGIA PLASTICA Y REPARADORA', 'CLÍNICA DERMATOLÓGICA', 'DIABETOLOGÍA', 'EPIDEMIOLOGÍA', 'GASTROENTEROLOGíA', 'NEUMONOLOGÍA', 'OFTALMOLOGÍA', 'ONCOLOGÍA', 'ORTOPEDIA Y TRAUMATOLOGÍA', 'OTORRINOLARINGOLOGÍA', 'PATOLOGÍA', 'PEDIATRÍA', 'PSIQUIATRÍA', 'REUMATOLOGÍA', 'UROLOGÍA'];
  tipoUsuario: string = '';
  especialidadSeleccionada = '';
  listaEspecialistas: User[] = [];
  especialistaSeleccionado: User = new User;
  listaTurnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  flagListaFiltrada = false;
  displayedColumns: string[] = ['especialidad', 'especialista', 'paciente', 'fecha', 'hora', 'estado'];
  dataSource!: MatTableDataSource<Turno>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  turnoSeleccionado!: Turno;
  cancelar = false;
  resenia = false;
  atencion = false;
  rechazar = false;
  finalizar = false;
  comentarioCalificacion: string = '';
  comentarioCancelar: string = '';
  comentarioFinalizacion: string = '';
  comentarioRechazar: string = '';
  user: User = new User();
  mostrarFormHistoriaClinica: boolean = false;
  ventanaComentario: boolean = false;


  constructor(private turnoService: TurnoService, private usuarioService: UsuariosService) {
    if (this.usuarioService.id) {
      this.turnoService.obtenerTurnosDelPaciente(this.usuarioService.id);
      this.user = this.usuarioService.usuarioSeleccionado;
    }
    if (this.usuarioService.role) {
      this.tipoUsuario = this.usuarioService.role;
    }
    this.turnoService.traerTodosLosTurnos().valueChanges().subscribe((data: any) => {
      this.listaTurnos = [];
      if (this.tipoUsuario === 'paciente') {
        data.forEach((element: Turno) => {
          if (element.pacienteId === this.usuarioService.id) {
            this.listaTurnos.push(element);
          }
        });
      } else if (this.tipoUsuario === 'especialista') {
        data.forEach((element: Turno) => {
          if (element.especialistaId === this.usuarioService.id) {
            this.listaTurnos.push(element);
          }
        });
      }
      this.dataSource = new MatTableDataSource(this.listaTurnos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  seleccionarTurno(turno: Turno) {
    this.turnoSeleccionado = turno;
    this.resenia = false;
  }

  ngOnInit(): void {
  }

  cancelarTurno() {
    this.cancelar = true;
  }

  enviarComentario() {
    if (this.tipoUsuario === 'paciente') {
      this.turnoSeleccionado.comentarioPaciente = this.comentarioCancelar;
      this.turnoSeleccionado.estado = 'cancelado';
      this.turnoService.guardarCambios(this.turnoSeleccionado);
      this.cancelar = false;
      this.comentarioCancelar = '';
    } else if (this.tipoUsuario === 'especialista') {
      this.turnoSeleccionado.comentarioEspecialista = this.comentarioCancelar;
      this.turnoSeleccionado.estado = 'cancelado';
      this.turnoService.guardarCambios(this.turnoSeleccionado);
      this.cancelar = false;
      this.comentarioCancelar = '';
    }
  }

  verResenia() {
    this.resenia = true;
  }

  rechazarTurno() {
    this.rechazar = true;
  }

  calificarAtencion() {
    this.atencion = true;
  }

  enviarCalificacion() {
    this.turnoSeleccionado.comentarioCalificacion = this.comentarioCalificacion;
    this.turnoService.guardarCambios(this.turnoSeleccionado);
    this.atencion = false;
    this.comentarioCancelar = '';
  }

  enviarRechazo() {
    this.turnoSeleccionado.comentarioEspecialista = this.comentarioRechazar;
    this.turnoSeleccionado.estado = 'rechazado';
    this.turnoService.guardarCambios(this.turnoSeleccionado);
    this.rechazar = false;
    this.comentarioRechazar = '';
  }

  aceptarTurno() {
    this.turnoSeleccionado.estado = 'aceptado';
    this.turnoService.guardarCambios(this.turnoSeleccionado);
  }

  finalizarTurno() {
    this.finalizar = true;
  }

  enviarFinalizacion() {
    this.mostrarFormHistoriaClinica = true;
  }

  cerrarVentanaHistoriaClinica(valor: any) {
    if (valor == false) {
      this.mostrarFormHistoriaClinica = false;
      this.turnoSeleccionado.comentarioEspecialista = this.comentarioFinalizacion;
      this.turnoSeleccionado.estado = 'realizado';
      let flag = false;

      console.log("this.user.pacientesAtendidos " + this.user.pacientesAtendidos);
      if (this.user.pacientesAtendidos) {
        this.user.pacientesAtendidos.forEach((registro: any) => {
          if (registro.pacienteId === this.turnoSeleccionado.pacienteId) {
            flag = true
          }
        });
        if (!flag) {
          let nuevoRegistro = {
            paciente: this.turnoSeleccionado.paciente,
            pacienteId: this.turnoSeleccionado.pacienteId
          };
          this.user.pacientesAtendidos.push(nuevoRegistro);
        }
      }
      console.log("this.user " + JSON.stringify(this.user));
      this.usuarioService.guardarCambios(this.user);
      this.turnoService.guardarCambios(this.turnoSeleccionado);
      this.finalizar = false;
      this.comentarioFinalizacion = '';
    }
  }
}
