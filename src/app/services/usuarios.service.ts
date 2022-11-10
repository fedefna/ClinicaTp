import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';
import { User } from '../Clases/user';
import { AuthService } from './auth.service';
import { FotosService } from './fotos.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private dbpathUsuarios = '/usuarios'; 
  // private dbpathPacientes = '/pacientes'; 
  // private dbpathEspecialistas = '/Especialistas';
  usuariosRef: AngularFirestoreCollection<User>;
  usuarios: Observable<any[]>;
  id?: string;
  role?: string;
  usuarioSeleccionado: any;
  usuario?:User;
  // usuariosRefPacientes: AngularFirestoreCollection<any>;
  // usuariosPacientes: Observable<any[]>;
  // usuariosRefEspecialistas: AngularFirestoreCollection<any>;
  // usuariosEspecialistas: Observable<any[]>;

  constructor(private db: AngularFirestore,
    private storage: AngularFireStorage,
    public firebaseAuth: AngularFireAuth) {
    this.usuariosRef = db.collection<any>(this.dbpathUsuarios, ref => ref.orderBy('apellido'));
    this.usuarios = this.usuariosRef.valueChanges(this.dbpathUsuarios);

    // this.usuariosRefPacientes = db.collection<any>(this.dbpathPacientes, ref => ref.where('role', '==', 'cliente').orderBy('apellido'));
    // this.usuariosPacientes = this.usuariosRefPacientes.valueChanges(this.dbpathPacientes);

    // this.usuariosRefEspecialistas = db.collection<any>(this.dbpathEspecialistas, ref => ref.where('role', '==', 'empleado').orderBy('apellido'));
    // this.usuariosEspecialistas = this.usuariosRefEspecialistas.valueChanges(this.dbpathEspecialistas);

  }

  // getAllPacientes() {
  //   return this.usuariosPacientes;
  // }

  // getAllEspecialistas() {
  //   return this.usuariosEspecialistas;
  // }

  async obtenerID(email: string) {
    await this.db.collection('/usuarios').ref.where('email', '==', email).get().then((responce) => {
      this.id = responce.docs[0].id;
    });
  }

  async obtenerRole(email: string) {
    await this.db.collection('/usuarios').ref.where('email', '==', email).get().then((responce:any) => {
      this.role = responce.docs[0].data()['role'];
    });
  }

  async obtenerUsuario(email: string) {
    await this.db.collection('/usuarios').ref.where('email', '==', email).get().then((responce) => {
      if (responce.docs.length === 0) {
        console.log('No hay usuario registrado con ese email: ', email);
      } else {
        this.usuarioSeleccionado = responce.docs[0].data();
        this.id = responce.docs[0].id;
      }
    });
  }


  getAll() {
    return this.usuarios;
  }

  nuevoUsuarioEspecialista(usuario: User, foto: File) {
    usuario.id = this.db.createId();
    usuario.emailVerificado=false;

    const pathRef = `fotos/${usuario.id}_1`;
    const fileRef = this.storage.ref(pathRef);
    const task = this.storage.upload(pathRef, foto);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(async res => {
          usuario.imageneEspecialista = res;
          this.db.collection('usuarios').doc(usuario.id).set(usuario);
        });
      })
    ).subscribe();

  }

  nuevoUsuarioPaciente(usuario: User, foto1: File, foto2: File) {
    usuario.id = this.db.createId();
    usuario.emailVerificado=false;

    const pathRef1 = `fotos/${usuario.id}_1`;
    const pathRef2 = `fotos/${usuario.id}_2`;
    const fileRef1 = this.storage.ref(pathRef1);
    const fileRef2 = this.storage.ref(pathRef2);
    const task1 = this.storage.upload(pathRef1, foto1);
    const task2 = this.storage.upload(pathRef2, foto2);
    task1.snapshotChanges().pipe(
      finalize(() => {
        fileRef1.getDownloadURL().subscribe(async res => {
          usuario.imagenesPaciente1 = res;
          task2.snapshotChanges().pipe(
            finalize(() => {
              fileRef2.getDownloadURL().subscribe(async res => {
                usuario.imagenesPaciente2 = res;
                this.db.collection('usuarios').doc(usuario.id).set(usuario);
              });
            })
          ).subscribe();
        });
      })
    ).subscribe();
    this.usuario=usuario;
    console.log(this.usuario);
  }

  guardarCambios(usuario: User) {
    this.db.collection('usuarios').doc(usuario.id).set(usuario);
  }

  borrrar(id: string): Promise<void> {
    return this.usuariosRef.doc(id).delete();
  }

  update(id: string, data: any): Promise<void> {
    return this.usuariosRef.doc(id).update(data);
  }

  crearId() {
    return this.db.createId();
  }

}
