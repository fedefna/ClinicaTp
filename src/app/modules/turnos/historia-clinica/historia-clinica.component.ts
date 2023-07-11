import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Historial } from 'src/app/Clases/historial';
import { Turno } from 'src/app/Clases/turno';
import { HistoriaClinicaService } from 'src/app/services/historia-clinica.service';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {

  @Input() turnoActual!: Turno;
  @Output() cerrarVentana: EventEmitter<any> = new EventEmitter<any>();
  public formHistoriaClinica: FormGroup;
  datoDinamico1: string = "";
  datoDinamico2: string = "";
  datoDinamico3: string = "";
  datoDinamico4: string = "";
  datoDinamico5: string = "";
  datoDinamico6: string = "";
  valorDinamico1: string = "";
  valorDinamico2: string = "";
  valorDinamico3: string = "";
  valorDinamico4: number = 50;
  valorDinamico5: number = 0;
  valorDinamico6: boolean = false;
  comentarios: any = [];
  mostrarError: boolean = false;
  constructor(private fb: FormBuilder, public historiaService: HistoriaClinicaService) {
    this.formHistoriaClinica = this.fb.group({
      'altura': ['', [Validators.required]],
      'peso': ['', [Validators.required]],
      'temperatura': ['', [Validators.required]],
      'presion': ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
  }


  cargarHistoria() {
    if (this.datoDinamico1 != ""
      && this.datoDinamico2 != ""
      && this.datoDinamico3 != ""
      && this.valorDinamico1 != ""
      && this.valorDinamico2 != ""
      && this.valorDinamico3 != "") {
      let comentario1 = {
        [this.datoDinamico1]: this.valorDinamico1,
      }
      let comentario2 = {
        [this.datoDinamico2]: this.valorDinamico2,
      }

      let comentario3 = {
        [this.datoDinamico3]: this.valorDinamico3,
      }
      this.comentarios.push(comentario1);
      this.comentarios.push(comentario2);
      this.comentarios.push(comentario3);

      let histrotial = new Historial(this.turnoActual.pacienteId, this.turnoActual.especialistaId, this.turnoActual.fecha, this.turnoActual.hora, this.turnoActual.especialidad,
        this.turnoActual.paciente, this.turnoActual.especialista, this.formHistoriaClinica.getRawValue().altura, this.formHistoriaClinica.getRawValue().peso, this.formHistoriaClinica.getRawValue().temperatura,
        this.formHistoriaClinica.getRawValue().presion, this.comentarios);
      this.historiaService.crearHistorial(histrotial);
      this.formHistoriaClinica.reset();
      this.cerrarVentana.emit(false);
    } else {
      this.mostrarError = true;
    }

  }

  cerrarError() {
    this.mostrarError = false;
  }


}
