import { Component, OnInit } from '@angular/core';
import { Historial } from 'src/app/Clases/historial';
import { Turno } from 'src/app/Clases/turno';
import { HistoriaClinicaService } from 'src/app/services/historia-clinica.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  mostrarFormHistoriaClinica: boolean = false;
  listaDeHistoriales:Historial[]=[];
  historialParaMostrar!:Historial;

  constructor(private usuarioService: UsuariosService, private historialService : HistoriaClinicaService) { }

  ngOnInit(): void {
    if(this.usuarioService.usuarioSeleccionado.id){
      this.historialService.obtenerHistoriasDelEspecialista(this.usuarioService.usuarioSeleccionado.id);
      this.listaDeHistoriales = this.historialService.listaDeHistorialesPorEspecialista;
    }
  }

  async verHistorial(historial:Historial) {
    this.mostrarFormHistoriaClinica = true;
    this.historialParaMostrar = historial;
  }

  cerrarVentanaHistoriaClinica(e:any){
    this.mostrarFormHistoriaClinica = e;
  }

}
