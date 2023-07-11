import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  referenciaAlaColeccion: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
    this.referenciaAlaColeccion = db.collection('/utilidades');
  }


  public traerTodasLasUtilidades() {
    return this.referenciaAlaColeccion;
  }

  public actualizarIdioma(utilidades:any) {
    // this.db.collection('utilidades').doc('ib1qyrPteRroLQ4cmx3h').set(utilidades);
    const utilidadesDocId = 'ib1qyrPteRroLQ4cmx3h'; // ID del documento de utilidades en Firebase
    this.db.collection('utilidades').doc(utilidadesDocId).update(utilidades);
  }
}
