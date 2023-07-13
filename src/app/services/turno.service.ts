import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Turno } from '../Clases/turno';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  referenciaAlaColeccion: AngularFirestoreCollection<Turno>;
  listaDeTurnosPorEspecialista:Turno[]=[];
  listaDeTurnosPorPaciente:Turno[]=[];
  turnoById!:Turno;

  constructor(private db: AngularFirestore) {
    this.referenciaAlaColeccion=db.collection('/turnos');
   }
  

  async obtenerTurnosDelEspecialista(especialistaId: string) {
    await this.referenciaAlaColeccion.ref.where('especialistaId', '==', especialistaId).get().then((responce: any) => {
      responce.docs.forEach((doc:any) => {
        this.listaDeTurnosPorEspecialista.push(doc.data());
      });
    });
    console.log(' this.listaDeTurnosPorEspecialista: ', this.listaDeTurnosPorEspecialista);
  }
  
  async obtenerTurnosDelPaciente(pacienteId: string) {
    this.listaDeTurnosPorPaciente=[];
    await this.referenciaAlaColeccion.ref.where('pacienteId', '==', pacienteId).get().then((responce: any) => {
      responce.docs.forEach((doc:any) => {
        this.listaDeTurnosPorPaciente.push(doc.data());
      });
    });
    console.log(' this.listaDeTurnosPorPaciente: ', this.listaDeTurnosPorPaciente);
  }

  async crearTurno(turno:Turno){
    turno.id = this.db.createId();
    this.db.collection('turnos').doc(turno.id).set({...turno});
  }

  public traerTodosLosTurnos(){
    return this.referenciaAlaColeccion;
  }

  guardarCambios(turno: Turno) {
    this.db.collection('turnos').doc(turno.id).set(turno);
  }
  
  async getTurnoById(turnoId:string){
    await this.db.collection<Turno>('turnos').ref.where('id', '==',turnoId).get().then((response)=>{
      console.log(response.docs[0]);
      console.log(response.docs[0].data());
      this.turnoById=response.docs[0].data();
    })
    return this.turnoById;
  }

}
