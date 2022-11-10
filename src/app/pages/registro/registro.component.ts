import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Roles, User } from 'src/app/Clases/user';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  registerForm!: FormGroup;
  imagenPaciente1: any = null;
  imagenPaciente2: any = null;
  imagenEspecialista: any = null;
  public user: Observable<User> = <any>this.authSvc.firebaseAuth.user;
  public tipoUsuario: Roles = 'paciente';

  constructor(
    private navegador: Router,
    private fb: FormBuilder,
    private usuarioService: UsuariosService,
    private authSvc: AuthService) {
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      'tipoUsuario': ['paciente', Validators.required],
      'nombre': ['', Validators.required],
      'apellido': ['', Validators.required],
      'email': ['', [Validators.email, Validators.required]],
      'obraSocial': ['', [Validators.required]],
      'dni': ['', [Validators.required, Validators.max(99999999)]],
      'fechaNacimiento': ['', [Validators.required]],
      'password': ['', [Validators.required, Validators.minLength(6)]],
      'password2': ['', [Validators.required, Validators.minLength(6)]]
    });
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

  async registrarUsuario() {
    if (this.registerForm?.value.password===this.registerForm?.value.password2) {

      try {
        const user = <any>await this.authSvc.SignUp(this.registerForm?.get('email')?.value.toLowerCase(), this.registerForm?.value.password);
        if (user) {
          console.log("creado auth");
          console.log(user);
          if (this.tipoUsuario === 'paciente') {
            await this.CrearUsuarioPaciente();
            this.authSvc.sendVerificationEmail();
          } else {
            if (this.tipoUsuario === 'especialista') {
              await this.CrearUsuarioEspecialista();
              this.authSvc.sendVerificationEmail();
            }
          }
          this.verificarUsuario(user);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
    }
  }

  async CrearUsuarioPaciente() {

    let usuario: User = {
      email: this.registerForm?.get('email')?.value,
      role: 'paciente',
      nombre: this.registerForm?.get('nombre')?.value,
      apellido: this.registerForm?.get('apellido')?.value,
      dni: this.registerForm?.get('dni')?.value,
      fechaNaciemiento: this.registerForm?.get('fechaNacimiento')?.value,
      obraSocial: this.registerForm?.get('obraSocial')?.value
    };
    const foto1 = this.imagenPaciente1;
    const foto2 = this.imagenPaciente2;
    await this.usuarioService.nuevoUsuarioPaciente(usuario, foto1, foto2);


  }

  CrearUsuarioEspecialista() {

    let usuario: User = {
      email: this.registerForm?.get('email')?.value,
      role: 'especialista',
      nombre: this.registerForm?.get('nombre')?.value,
      apellido: this.registerForm?.get('apellido')?.value,
      dni: this.registerForm?.get('dni')?.value,
      fechaNaciemiento: this.registerForm?.get('fechaNacimiento')?.value,
      especialidad: this.registerForm?.get('especialidad')?.value
    };
    const foto = this.imagenEspecialista;
    this.usuarioService.nuevoUsuarioEspecialista(usuario, foto);

  }

  private verificarUsuario(user: User) {
    if (user && user.emailVerificado) {
      this.navegador.navigate(['/']);
      localStorage.setItem('usuario', this.registerForm?.get('email')?.value.toLowerCase());
    } else if (user) {
      this.navegador.navigate(['/verificacion-registro']);
    } else {
      this.navegador.navigate(['/registro']);
    }
  }

  Navegar(ruta: string) {
    console.log("entra en navegar");
    this.navegador.navigate([ruta]);
  }

  Desconectarse() {
    this.authSvc.LogOut();
    this.Navegar("home");
  }

}
