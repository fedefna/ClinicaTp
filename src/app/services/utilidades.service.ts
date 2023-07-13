import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  referenciaAlaColeccion: AngularFirestoreCollection<any>;
  idioma$: Observable<string>;
  captcha$: Observable<boolean>;
  utilidadesDocId = 'ib1qyrPteRroLQ4cmx3h'; // ID del documento de utilidades en Firebase

  constructor(private db: AngularFirestore) {
    this.referenciaAlaColeccion = db.collection('/utilidades');
    this.idioma$ = this.referenciaAlaColeccion.doc(this.utilidadesDocId).snapshotChanges().pipe(
      map((snapshot)=>{
        console.log('Se modifico el documento utilidades: ',snapshot.payload.data());
        const data = snapshot.payload.data();
        return data.idioma;
      })
    );

    this.captcha$ = this.referenciaAlaColeccion.doc(this.utilidadesDocId).snapshotChanges().pipe(
      map((snapshot)=>{
        console.log('Se modifico el documento utilidades: ',snapshot.payload.data());
        const data = snapshot.payload.data();
        return data.captcha;
      })
    );
  }


  public traerTodasLasUtilidades() {
    return this.referenciaAlaColeccion;
  }

  public actualizarIdioma(utilidades:any) {
    console.log('actualizarIdioma recibe: ',utilidades);
    this.db.collection('utilidades').doc(this.utilidadesDocId).update(utilidades);
  }

  public actualizarCaptcha(utilidades:any) {
    console.log('actualizarCaptcha recibe: ',utilidades);
    this.db.collection('utilidades').doc(this.utilidadesDocId).update(utilidades);
  }
}
