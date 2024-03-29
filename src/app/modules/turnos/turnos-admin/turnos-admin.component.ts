import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Turno } from 'src/app/Clases/turno';
import { User } from 'src/app/Clases/user';
import { TurnoService } from 'src/app/services/turno.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';

@Component({
  selector: 'app-turnos-admin',
  templateUrl: './turnos-admin.component.html',
  styleUrls: ['./turnos-admin.component.css']
})
export class TurnosAdminComponent implements OnInit {

  tipoUsuario: string = '';
  especialidadSeleccionada = '';
  listaEspecialistas: User[] = [];
  especialistaSeleccionado: User = new User;
  listaTurnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  flagListaFiltrada = false;
  displayedColumns: string[] = ['especialidad', 'paciente', 'especialista', 'fecha', 'hora', 'estado', 'acciones'];
  dataSource!: MatTableDataSource<Turno>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  turnoSeleccionado!: Turno;
  cancelar = false;
  comentarioCancelar: string = '';
  idiomaSeleccionado: string = 'esp';

  columnaEspecialidad='Especialidad';
  columnaEspecialista='Especialista';
  columnaPaciente='Paciente';
  columnaFecha='Fecha';
  columnaHora='Hora';
  columnaEstado='Estado';
  columnaAcciones='Acciones';
  labelFiltro='...filtro';
  botonCancelar='Cancelar';
  sinTurnos='No hay turnos..';
  labelIngresarComentario='Ingrese un comentario para cancelar el turno:';
  botonEnviarComentario='Enviar comentario';
  turnoTitulo='Turnos';

  constructor(private turnoService: TurnoService, private usuarioService: UsuariosService, private utils: UtilidadesService) {
    if (this.usuarioService.id) {
      this.turnoService.obtenerTurnosDelPaciente(this.usuarioService.id);
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
      } else if (this.tipoUsuario === 'admin') {
        data.forEach((element: Turno) => {
          this.listaTurnos.push(element);
        });
      }
      this.dataSource = new MatTableDataSource(this.listaTurnos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.actualizarIdioma();
    this.utils.idioma$.subscribe(idioma=>{
      this.idiomaSeleccionado = idioma;
      this.actualizarIdioma();
    });
  }

  ngOnInit(): void {
  }

  actualizarIdioma() {
    if (this.idiomaSeleccionado === 'esp') {
      this.columnaEspecialidad = 'Especialidad';
      this.columnaEspecialista='Especialista';
      this.columnaPaciente='Paciente';
      this.columnaFecha='Fecha';
      this.columnaHora='Hora';
      this.columnaEstado='Estado';
      this.columnaAcciones='Acciones';
      this.labelFiltro='...filtro';
      this.botonCancelar='Cancelar';
      this.sinTurnos='No hay turnos..';
      this.labelIngresarComentario='Ingrese un comentario para cancelar el turno:';
      this.botonEnviarComentario='Enviar comentario';
      this.turnoTitulo='Turnos';
    } else {
      if (this.idiomaSeleccionado === 'ing') {
        this.columnaEspecialidad = 'Specialty';
        this.columnaEspecialista='Specialist';
        this.columnaPaciente='Patient';
        this.columnaFecha='Date';
        this.columnaHora='Hour';
        this.columnaEstado='State';
        this.columnaAcciones='Actions';
        this.labelFiltro='...filter';
        this.botonCancelar='Cancel';
        this.sinTurnos='No shifts..';
        this.labelIngresarComentario='Enter a comment to cancel the turn:';
        this.botonEnviarComentario='Send comment';
        this.turnoTitulo='Shifts';
      } else {
        if (this.idiomaSeleccionado === 'por') {
          this.columnaEspecialidad = 'Especialidade';
          this.columnaEspecialista='Especialista';
          this.columnaPaciente='Paciente';
          this.columnaFecha='Data';
          this.columnaHora='Hora';
          this.columnaEstado='Estado';
          this.columnaAcciones='Ações';
          this.labelFiltro='...filtro';
          this.botonCancelar='Cancelar';
          this.sinTurnos='Sem turnos..';
          this.labelIngresarComentario='Insira um comentário para cancelar a vez:';
          this.botonEnviarComentario='Enviar comentário';
          this.turnoTitulo='mudança';
        }
      }
    }
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
  }

  cancelarTurno(turno:Turno) {
    this.cancelar = true;
    this.turnoSeleccionado=turno;
  }

  enviarComentario() {
    console.log('this.comentarioCancelar '+this.comentarioCancelar);
    console.log('this.turnoSeleccionado.comentarioEspecialista '+this.turnoSeleccionado.comentarioEspecialista);
    this.turnoSeleccionado.comentarioEspecialista = this.comentarioCancelar;
    console.log('this.turnoSeleccionado.comentarioEspecialista '+this.turnoSeleccionado.comentarioEspecialista);
    this.turnoSeleccionado.estado = 'cancelado';
    this.turnoService.guardarCambios(this.turnoSeleccionado);
    this.cancelar = false;
    this.comentarioCancelar = '';
  }
}
