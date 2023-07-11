import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { Observable } from 'rxjs';
import { Roles, User } from 'src/app/Clases/user';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Especialidades } from '../../Clases/user';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  registerFormPaciente!: FormGroup;
  registerFormEspecialista!: FormGroup;
  imagenPaciente1: any = null;
  imagenPaciente2: any = null;
  imagenEspecialista: any = null;
  public user: Observable<User> = <any>this.authSvc.firebaseAuth.user;
  public tipoUsuario: Roles = 'paciente';
  listaEspecialidades: string[] = ['ALERGIA E INMUNOLOGÍA', 'CARDIOLOGIA', 'CIRUGIA DE TORAX', 'CIRUGIA GENERAL', 'CIRUGIA PEDIATRICA', 'CIRUGIA PLASTICA Y REPARADORA', 'CLÍNICA DERMATOLÓGICA', 'DIABETOLOGÍA', 'EPIDEMIOLOGÍA', 'GASTROENTEROLOGíA', 'NEUMONOLOGÍA', 'OFTALMOLOGÍA', 'ONCOLOGÍA', 'ORTOPEDIA Y TRAUMATOLOGÍA', 'OTORRINOLARINGOLOGÍA', 'PATOLOGÍA', 'PEDIATRÍA', 'PSIQUIATRÍA', 'REUMATOLOGÍA', 'UROLOGÍA'];
  especialidades: string[] = [];

  constructor(
    private navegador: Router,
    private fb: FormBuilder,
    private usuarioService: UsuariosService,
    private authSvc: AuthService) {
  }

  async ngOnInit() {
    this.registerFormPaciente = this.fb.group({
      'nombre': ['', Validators.required],
      'apellido': ['', Validators.required],
      'email': ['', [Validators.email, Validators.required]],
      'obraSocial': ['', [Validators.required]],
      'dni': ['', [Validators.required, Validators.max(99999999)]],
      'fechaNacimiento': ['', [Validators.required]],
      'password': ['', [Validators.required, Validators.minLength(6)]],
      'password2': ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerFormEspecialista = this.fb.group({
      'nombreEspecialista': ['', Validators.required],
      'apellidoEspecialista': ['', Validators.required],
      'emailEspecialista': ['', [Validators.email, Validators.required]],
      'dniEspecialista': ['', [Validators.required, Validators.max(99999999)]],
      'fechaNacimientoEspecialista': ['', [Validators.required]],
      'passwordEspecialista': ['', [Validators.required, Validators.minLength(6)]],
      'password2Especialista': ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  setEspecialista() {
    this.tipoUsuario = "especialista";
  }

  setPaciente() {
    this.tipoUsuario = "paciente";
  }

  changeImgPaciente1(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.imagenPaciente1 = event.target.files[0];
    }
  }

  changeImgPaciente2(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.imagenPaciente2 = event.target.files[0];
    }
  }

  changeImgEspecialista(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.imagenEspecialista = event.target.files[0];
    }
  }

  async registrarPaciente() {
    if (this.registerFormPaciente?.value.password === this.registerFormPaciente?.value.password2) {
      try {
        const user = <any>await this.authSvc.SignUp(this.registerFormPaciente?.get('email')?.value.toLowerCase(), this.registerFormPaciente?.value.password);
        if (user) {
          console.log("creado auth");
          console.log(user);
          await this.CrearUsuarioPaciente();
          this.authSvc.sendVerificationEmail();
          this.navegador.navigate(['/verificacion-registro']);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
    }
  }

  async registrarEspecialista() {
    if (this.registerFormEspecialista?.value.passwordEspecialista === this.registerFormEspecialista?.value.password2Especialista) {
      try {
        const user = <any>await this.authSvc.SignUp(this.registerFormEspecialista?.get('emailEspecialista')?.value.toLowerCase(), this.registerFormEspecialista?.value.passwordEspecialista);
        if (user) {
          console.log("creado auth");
          console.log(user);
          await this.CrearUsuarioEspecialista();
          this.authSvc.sendVerificationEmail();
          this.navegador.navigate(['/verificacion-registro']);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async CrearUsuarioPaciente() {

    let usuario: User = {
      email: this.registerFormPaciente?.get('email')?.value,
      role: 'paciente',
      nombre: this.registerFormPaciente?.get('nombre')?.value,
      apellido: this.registerFormPaciente?.get('apellido')?.value,
      dni: this.registerFormPaciente?.get('dni')?.value,
      fechaNaciemiento: this.registerFormPaciente?.get('fechaNacimiento')?.value,
      obraSocial: this.registerFormPaciente?.get('obraSocial')?.value
    };
    const foto1 = this.imagenPaciente1;
    const foto2 = this.imagenPaciente2;
    await this.usuarioService.nuevoUsuarioPaciente(usuario, foto1, foto2);
  }

  CrearUsuarioEspecialista() {
    let usuario: User = {
      email: this.registerFormEspecialista?.get('emailEspecialista')?.value,
      role: 'especialista',
      nombre: this.registerFormEspecialista?.get('nombreEspecialista')?.value,
      apellido: this.registerFormEspecialista?.get('apellidoEspecialista')?.value,
      dni: this.registerFormEspecialista?.get('dniEspecialista')?.value,
      fechaNaciemiento: this.registerFormEspecialista?.get('fechaNacimientoEspecialista')?.value,
      pacientesAtendidos: []
    };
    usuario.especialidades = this.especialidades;
    const foto = this.imagenEspecialista;
    this.usuarioService.nuevoUsuarioEspecialista(usuario, foto);
  }

  Navegar(ruta: string) {
    console.log("entra en navegar");
    this.navegador.navigate([ruta]);
  }

  Desconectarse() {
    this.authSvc.LogOut();
    this.Navegar("home");
  }


  agregarEspecialidad(especialidad: string) {
    let flag = false;
    if (this.especialidades.length > 0) {
      this.especialidades.forEach(element => {
        if (element === especialidad) {
          flag = true;
        }
      });
      if (flag) {
        this.especialidades.splice(this.especialidades.indexOf(especialidad), 1);
      } else {
        this.especialidades.push(especialidad);
      }
    } else {
      this.especialidades.push(especialidad);
    }
  }

}
