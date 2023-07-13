import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Observable } from 'rxjs';
import { ExcelService } from '../services/excel.service';
import { PdfServiceService } from '../services/pdf-service.service';
import { TurnoService } from '../services/turno.service';
import { UsuariosService } from '../services/usuarios.service';
Chart.register(...registerables);

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {

  listaTurnos: any;
  listaLogeos: any;
  listaEspecialidades: any;
  listaEspecialistas: any;
  listaLogeosExcel: any;
  mostrarEspecialidades: boolean = false;
  mostrarDias: boolean = false;
  mostrarLogeos: boolean = false;
  mostrarTurnos: boolean = false;
  totalTurnosFinalizados: number = 0;
  totalTurnosSolicitados: number = 0;
  turnosPorDia: number = 0;
  myChart: any;
  logs$?: Observable<any[]>;



  constructor(public turnoService: TurnoService, public pdfService: PdfServiceService, public excelService: ExcelService, private usuarioService: UsuariosService) {
    this.listaTurnos = [];
    this.listaEspecialidades = [];
    this.listaLogeos = [];
    this.turnoService.referenciaAlaColeccion.valueChanges().subscribe((data: any) => {
      this.listaTurnos = data;
      this.contarTurnosPorEspecialidad();
      this.contarTurnosPorEspecialista();
      this.contarTurnosPorSemana();
      this.graficoTurnos();
      this.contarTurnosPorDia();
    });
    this.logs$=this.usuarioService.getLogs();
    // this.usuarioService.traerLogs('logeoId').subscribe(
    //   resp => {
    //     console.log('Forma vieja recibe: ',resp);
    //     this.listaLogeos = resp;
    //   });
  }

  ngOnInit(): void {
    this.logs$=this.usuarioService.getLogs();
  }


  contarTurnosPorEspecialidad() {
    this.listaEspecialidades = [];
    let isFound = false;
    let indiceUsuario = 0;
    let especialidadActual: any;
    for (let i = 0; i < this.listaTurnos.length; i++) {
      especialidadActual = {
        nombre: '',
        cantidadTurnos: 0,
      }
      especialidadActual.nombre = this.listaTurnos[i].especialidad;
      for (let j = 0; j < this.listaEspecialidades.length; j++) {
        if (especialidadActual.nombre == this.listaEspecialidades[j].nombre) {
          indiceUsuario = j;
          isFound = true;
          break;
        }
      }
      if (isFound) {
        isFound = false;
        this.listaEspecialidades[indiceUsuario].cantidadTurnos++;
      } else {
        especialidadActual.nombre = this.listaTurnos[i].especialidad;
        especialidadActual.cantidadTurnos = 1;
        this.listaEspecialidades.push(especialidadActual);
      }
    }
  }

  contarTurnosPorSemana() {
    let fechaActual: Date = new Date();
    let fechaLimite: Date = new Date();
    fechaLimite.setDate(fechaActual.getDate() - 7);

    for (let i = 0; i < this.listaTurnos.length; i++) {
      let date = this.listaTurnos[i].fecha;
      console.log('this.listaTurnos[i].estado ',this.listaTurnos[i].estado)
      console.log('Primer date sin magia date ',date)
      const [day, month, year] = date.split('/');
      date = new Date(+year, +month - 1, +day);
      console.log('Segundo date ',date)
      console.log('fechaLimite',fechaLimite)
      console.log('fechaActual ',fechaActual)
      if (date >= fechaLimite && date <= fechaActual) {
        if (this.listaTurnos[i].estado == 'Realizado') {
          this.totalTurnosFinalizados++;
          this.totalTurnosSolicitados++;
          console.log('Suma Finalizado y Solicitados')
        } else {
          this.totalTurnosSolicitados++;
          console.log('Suma Solicitados')
        }
      } else {
        console.log('no va')
      }
    }
  }

  contarTurnosPorDia() {
    let contadorTurnos = 0;
    let arrayDias: any[] = [];
    this.listaTurnos.forEach((turno: any) => {
      let flag = false;
      contadorTurnos++;
      if (arrayDias.length > 0) {
        arrayDias.forEach(dia => {
          if (dia === turno.fecha) {
            flag = true;
          }
        });
      }
      if (!flag) {
        arrayDias.push(turno.fecha);
      }
    });
    this.turnosPorDia = (contadorTurnos / arrayDias.length);
  }

  graficoTurnos() {
    //const canvas =  <HTMLCanvasElement> document.getElementById('turnosChart');
    //const ctx = canvas?.getContext('2d');
    if (this.myChart) {
      this.myChart.destroy();
    }
    this.myChart = new Chart("turnosChart", {
      type: 'bar',
      data: {
        labels: ['Turnos Finalizados', 'Turnos Solicitados'],
        datasets: [{
          label: '# de Turnos esta Semana',
          data: [this.totalTurnosFinalizados, this.totalTurnosSolicitados],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  mostrarVentanaDatos(opcion: string) {
    switch (opcion) {
      case 'especialidades':
        this.mostrarEspecialidades = true;
        this.mostrarLogeos = false;
        this.mostrarTurnos = false;
        break;
      case 'turnos':
        this.mostrarLogeos = false;
        this.mostrarEspecialidades = false;
        this.mostrarTurnos = true;
        break;
      case 'logeos':
        this.mostrarLogeos = true;
        this.mostrarEspecialidades = false;

        this.mostrarTurnos = false;
        break;

    }
  }

  descargarPDFEstadisticas() {
    let datos = {
      cantTurnosEspecialidades: this.listaEspecialidades,
      cantTurnosFinalizados: this.totalTurnosFinalizados,
      cantTurnosSolicitados: this.totalTurnosSolicitados,
      cantTurnosPorDia: this.turnosPorDia,
      logeos: this.listaLogeos
    }
    this.pdfService.generatePDFEstadisticas(datos, 'Informe de estadisticas', 'InformeEstadisticas');
  }

  descargarExcelLogeos() {
    this.listaLogeosExcel = [];
    let datos;
    for (let i = 0; i < this.listaLogeos.length; i++) {
      datos = {
        usuario: this.listaLogeos[i].usuario,
        email: this.listaLogeos[i].email,
        dia: this.listaLogeos[i].fecha,
        hora: this.listaLogeos[i].horario,
        tipoUsuario: this.listaLogeos[i].tipoUsuario
      }
      this.listaLogeosExcel.push(datos);
    }
    this.excelService.descargarExcelLogeos(this.listaLogeosExcel, 'lista usuarios');
  }

  contarTurnosPorEspecialista() {
    this.listaEspecialistas = [];
    let isFound = false;
    let indiceUsuario = 0;
    let especialistaActual: any;
    for (let i = 0; i < this.listaTurnos.length; i++) {
      especialistaActual = {
        nombre: '',
        cantidadTurnos: 0,
      }
      especialistaActual.nombre = this.listaTurnos[i].especialista;
      for (let j = 0; j < this.listaEspecialistas.length; j++) {
        if (especialistaActual.nombre == this.listaEspecialistas[j].nombre) {
          indiceUsuario = j;
          isFound = true;
          break;
        }
      }
      if (isFound) {
        isFound = false;
        this.listaEspecialistas[indiceUsuario].cantidadTurnos++;
      } else {
        especialistaActual.nombre = this.listaTurnos[i].especialista;
        especialistaActual.cantidadTurnos = 1;
        this.listaEspecialistas.push(especialistaActual);
      }
    }
  }

}
