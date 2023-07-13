import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Historial } from '../Clases/historial';

@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaService {

  referenciaAlaColeccion: AngularFirestoreCollection<Historial>;
  listaDeHistorialesPorPaciente:Historial[]=[];
  listaDeHistorialesPorEspecialista:Historial[]=[];

  constructor(private db: AngularFirestore) {
    this.referenciaAlaColeccion=db.collection('/historial');
   }
  

  async obtenerHistorialDelPaciente(pacienteId: string) {
    await this.referenciaAlaColeccion.ref.where('pacienteId', '==', pacienteId).get().then((responce: any) => {
      responce.docs.forEach((doc:any) => {
        this.listaDeHistorialesPorPaciente.push(doc.data());
      });
    });
    console.log(' this.listaDeHistorialesPorPaciente: ', this.listaDeHistorialesPorPaciente);
  }

  async obtenerHistoriasDelEspecialista(especialistaId: string) {
    await this.referenciaAlaColeccion.ref.where('especialistaId', '==', especialistaId).get().then((responce: any) => {
      responce.docs.forEach((doc:any) => {
        this.listaDeHistorialesPorEspecialista.push(doc.data());
      });
    });
    console.log(' this.listaDeHistorialesPorEspecialista: ', this.listaDeHistorialesPorEspecialista);
  }

  async crearHistorial(historial:Historial){
    historial.id = this.db.createId();
    console.log("historial "+historial);
    console.log("JSON.stringify(historial "+JSON.stringify(historial));
    // this.db.collection('turnos').doc(historial.id).set({...historial});
    this.referenciaAlaColeccion.add({...historial});
  }

  public traerTodosLosHistoriales(){
    return this.referenciaAlaColeccion;
  }
}
