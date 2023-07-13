import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, map, Observable, take } from 'rxjs';
import { Especialidades, User } from '../Clases/user';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Hora } from '../Clases/hora';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private dbpathUsuarios = '/usuarios';
  private dbpathLogs = '/LogIngresos';
  usuariosRef: AngularFirestoreCollection<User>;
  usuarios$: Observable<any[]>;
  especialidad?: Especialidades;
  imageneEspecialista?: string;
  usuariosPorEspecialidad: User[] = [];
  id?: string;
  role?: string;
  public usuarioSeleccionado: User = new User();
  usuario?: User;
  // listaLogs$: Observable<any>;

  constructor(private db: AngularFirestore,
    private storage: AngularFireStorage,
    public firebaseAuth: AuthService) {

      this.usuariosRef = db.collection<User>(this.dbpathUsuarios, ref => ref.orderBy('apellido'));
      this.usuarios$ = this.usuariosRef.valueChanges(this.dbpathUsuarios);
      console.log('this.usuariosRef ',this.usuariosRef)
      console.log('this.usuarios$ ',this.usuarios$)
      // this.listaLogs$ = this.usuariosRef.doc(this.dbpathLogs).snapshotChanges().pipe(
      //   map((snapshot)=>{
      //     console.log('Se modifico el documento utilidades: ',snapshot.payload.data());
      //     const data = snapshot.payload.data();
      //     return data.idioma;
      //   })
      // );
  }

  async obtenerID(email: string) {
    console.log('obtenerID ');
    await this.db.collection('/usuarios').ref.where('email', '==', email).get().then((responce) => {
      console.log('Dentro de obtenerId ');
      this.id = responce.docs[0].id;
    });
  }

  async obtenerRole(email: string) {
    console.log('obtenerRole ');
    await this.db.collection('/usuarios').ref.where('email', '==', email).get().then((responce: any) => {
      console.log('dentro de obtenerRole ');
      this.role = responce.docs[0].data()['role'];
    });
  }

  async obtenerUsuario(email: string) {
    console.log('obtenerUsuario ');
    await this.db.collection('/usuarios').ref.where('email', '==', email).get().then((responce: any) => {
      if (responce.docs.length === 0) {
        console.log('No hay usuario registrado con ese email: ', email);
      } else {
        console.log('Obtener usuario: ', responce.docs[0].data());
        this.usuarioSeleccionado = responce.docs[0].data();
        this.role = responce.docs[0].data()['role'];
        this.id = responce.docs[0].id;
      }
    });
  }

  obtenerUsuariosSegunEspecialidad(array: User[] = [], especialidad: string) {
    console.log('obtenerUsuariosSegunEspecialidad ');
    this.usuarios$.pipe(take(1)).subscribe(list => {
      console.log('dentro de obtenerUsuariosSegunEspecialidad ');
      list.forEach(user => {
        if (user.especialidades) {
          user.especialidades.forEach((espec: string) => {
            console.log('user: ', user.nombre, 'especialidad: ', especialidad, ' a comparar con: ', espec);
            if (espec === especialidad) {
              array.push(user)
            }
          });
        }
      });
      console.log(array);
    });
  }


  getAll() {
    console.log('getAll ');
    return this.usuarios$;
  }

  nuevoUsuarioEspecialista(usuario: any, foto: File) {
    console.log('nuevoUsuarioEspecialista ');
    usuario.id = this.db.createId();
    usuario.emailVerificado = false;
    let horarios = this.crearHorario()
    let horarioMap = horarios.map((obj) => { return Object.assign({}, obj) });

    console.log("horariosMap " + horarioMap);
    usuario.horariosMap = horarioMap;

    const pathRef = `fotos/${usuario.id}_1`;
    const fileRef = this.storage.ref(pathRef);
    const task = this.storage.upload(pathRef, foto);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(async res => {
          console.log('dentro de nuevoUsuarioEspecialista ');
          usuario.imagenEspecialista = res;
          this.db.collection('usuarios').doc(usuario.id).set(usuario);
        });
      })
    ).subscribe();

  }

  crearHorario() {
    let horas: any[] = [];
    horas.push(new Hora('08:00'));
    horas.push(new Hora('08:30'));
    horas.push(new Hora('09:00'));
    horas.push(new Hora('09:30'));
    horas.push(new Hora('10:00'));
    horas.push(new Hora('10:30'));
    horas.push(new Hora('11:00'));
    horas.push(new Hora('11:30'));
    horas.push(new Hora('12:00'));
    horas.push(new Hora('12:30'));
    horas.push(new Hora('13:00'));
    horas.push(new Hora('13:30'));
    horas.push(new Hora('14:00'));
    horas.push(new Hora('14:30'));
    horas.push(new Hora('15:00'));
    horas.push(new Hora('15:30'));
    horas.push(new Hora('16:00'));
    horas.push(new Hora('16:30'));
    horas.push(new Hora('17:00'));
    horas.push(new Hora('17:30'));
    horas.push(new Hora('18:00'));
    horas.push(new Hora('18:30'));
    console.log("Horas " + horas);
    return horas;
  }

  nuevoUsuarioAdmin(usuario: User, foto: File) {
    console.log('nuevoUsuarioAdmin ');
    usuario.id = this.db.createId();
    usuario.emailVerificado = false;

    const pathRef = `fotos/${usuario.id}_1`;
    const fileRef = this.storage.ref(pathRef);
    const task = this.storage.upload(pathRef, foto);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(async res => {
          usuario.imagenEspecialista = res;
          this.db.collection('usuarios').doc(usuario.id).set(usuario);
        });
      })
    ).subscribe();
  }

  nuevoUsuarioPaciente(usuario: User, foto1: File, foto2: File) {
    usuario.id = this.db.createId();
    usuario.emailVerificado = false;

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
    this.usuario = usuario;
    console.log("Este es el thi.usuario del servicio usuarios: " + this.usuario);
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

  async traerEspecialidades() {
    console.log('traerEspecialidades ');
    await this.db.collection('/especialidades').ref.get().then((responce: any) => {
      return responce.docs[0].data();
    });
  }

  agregarLogIngreso(coleccion: string, datos: any) {
    console.log('agregarLogIngreso ');
    this.db.collection(coleccion).add(datos);
  }

  traerLogs(nombreIdField: string) {
    console.log('traerLogs ');
    return this.db.collection('LogIngresos').valueChanges({ idField: nombreIdField });
  }
  
  getLogs(): Observable<any[]> {
    return this.db.collection('Logs', ref => ref.orderBy('fecha', 'desc').limit(7)).valueChanges();
    // return this.db.collection('LogIngresos', ref => ref.orderBy('fecha', 'desc').limit(7)).valueChanges();
  }

}
