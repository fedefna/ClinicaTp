import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/Clases/user';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { MatFabMenu } from '@angular-material-extensions/fab-menu';
import { UtilidadesService } from 'src/app/services/utilidades.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  ingresoApp = false;
  iniciado = false;
  captchaOkay: boolean = false;
  captchaUtilidades: boolean = false;
  errorCaptcha: boolean = false;
  emailIngreso: string = '';
  contraIngreso: string = '';
  mostrar = false;
  usuarioLogueado = new User();
  idiomaSeleccionado: string = '';
  // email: string = 'Email';
  correo: string = 'Correo';
  contra: string = 'Contraseña';
  iniciarSesion: string = 'Iniciar Sesion';
  password: string = 'Contraseña';
  errorCaptchaTraducido: string = 'Debe realizar el captcha';
  ingresar: string = 'Ingresar';

  fabButtonsRandom: MatFabMenu[] = [
    {
      id: 1,
      imgUrl: '/assets/paciente1.svg',
      tooltip: 'Paciente 1',
      tooltipPosition: "right"
    },
    {
      id: 2,
      imgUrl: '/assets/paciente2.svg',
      tooltip: 'Paciente 2',
      tooltipPosition: "right"
    },
    {
      id: 3,
      imgUrl: '/assets/paciente3.svg',
      tooltip: 'Paciente 3',
      tooltipPosition: "right"
    },
    {
      id: 4,
      imgUrl: '/assets/especialista1.svg',
      tooltip: 'Especialista 1',
      tooltipPosition: "right"
    },
    {
      id: 5,
      imgUrl: '/assets/especialista2.svg',
      tooltip: 'Especialista 2',
      tooltipPosition: "right"
    },
    {
      id: 6,
      imgUrl: '/assets/admin.svg',
      tooltip: 'Admin',
      tooltipPosition: "right"
    }
  ];

  fabButonSeleccionado = (event: any) => {
    this.cargarUsuario(<string>event);
  }



  constructor(public firebaseService: AuthService, private router: Router, private usuarioService: UsuariosService, private utilidadesService: UtilidadesService, private utils: UtilidadesService) {
    // this.utilidadesService.traerTodasLasUtilidades().valueChanges().subscribe((data: any) => {

    //   data.forEach((utilidades: any) => {
    //     if (utilidades.captcha == true) {
    //       this.captchaUtilidades = true;
    //     } else {
    //       this.captchaUtilidades = false;
    //     }
    //   }
    //   )
    // });
    // this.utils.traerTodasLasUtilidades().valueChanges().subscribe((data: any) => {
    //   data.forEach((utilidades: any) => {
    //     if (utilidades.idioma) { 
    //       this.idiomaSeleccionado = utilidades.idioma;
    //       // this.actualizarIdioma();
    //     }
    //   }
    //   )
    // });
  }

  ngOnInit() {
    this.utils.idioma$.subscribe(idioma=>{
      console.log('idioma recibido: ',idioma);
      this.idiomaSeleccionado = idioma;
      this.actualizarIdioma();
    });
    this.utils.captcha$.subscribe(captcha=>{
      console.log('captcha recibido: ',captcha);
      this.captchaUtilidades = captcha;
    });
  }

  async OnSignIn(email: string, password: string) {
    if (this.captchaUtilidades) {
      if (this.captchaOkay) {
        try {
          const user: any = await this.firebaseService?.SignIn(email, password);
          console.log(user);
          this.checkUserIsVerified(user);
          localStorage.setItem('usuario', email);
          // await this.firebaseService?.SignIn(email, password).then();
        } catch (error) {
          console.log(error);
        }
      } else {
        this.errorCaptcha = true;
      }
    } else {
      try {
        const user: any = await this.firebaseService?.SignIn(email, password);
        console.log(user);
        this.checkUserIsVerified(user);
        localStorage.setItem('usuario', email);
        // await this.firebaseService?.SignIn(email, password).then();
      } catch (error) {
        console.log(error);
      }
    }
  }

  cargarUsuario(ingreso: any) {
    switch (ingreso) {
      //pacientes
      case 1:
        this.emailIngreso = 'docaros780@lance7.com';
        this.contraIngreso = 'Asd1234';
        break;
      case 2:
        this.emailIngreso = 'hehajes608@pamaweb.com';
        this.contraIngreso = 'Asd1234';
        break;
      case 3:
        this.emailIngreso = 'vajifi6754@kixotic.com';
        this.contraIngreso = 'Asd1234';
        break;
      //Especialistas
      case 4:
        this.emailIngreso = 'tiharej344@kuvasin.com';
        this.contraIngreso = 'Asd1234';
        break;
      case 5:
        this.emailIngreso = 'pewodin697@probdd.com';
        this.contraIngreso = 'Asd1234';
        break;
      //admin
      case 6:
        this.emailIngreso = 'wogegef659@lidely.com';
        this.contraIngreso = 'Asd1234';
        break;
    }
  }


  private async checkUserIsVerified(user: any) {
    console.log('entra en chequeo de usuario');
    if (user) {
      await this.usuarioService.obtenerUsuario(user.email);
      this.usuarioLogueado = this.usuarioService.usuarioSeleccionado;
      console.log(user?.emailVerified);
      console.log(this.usuarioLogueado);

      if (this.usuarioLogueado.role === 'paciente') {
        if (user.emailVerified == true) {
          if (this.usuarioLogueado.emailVerificado == false) {
            await this.usuarioService.obtenerID(user.email);
            if (this.usuarioService.id) {
              this.usuarioService.update(this.usuarioService.id, { emailVerificado: true });
              this.router.navigate(['/bienvenidos']);
              this.agregarLogIngreso();
            }
          } else {
            this.router.navigate(['/bienvenidos']);
            this.agregarLogIngreso();
          }
        } else {
          this.router.navigate(['/verificacion-registro']);
        }
      } else if (this.usuarioLogueado.role === 'especialista') {
        if (user.emailVerified == true) {
          if (this.usuarioLogueado.emailVerificado == false) {
            this.router.navigate(['/verificacion-registro']);
          } else {
            this.router.navigate(['/bienvenidos']);
            this.agregarLogIngreso();
          }
        } else {
          this.router.navigate(['/verificacion-registro']);
        }
      } else if (this.usuarioLogueado.role === 'admin') {
        if (user.emailVerified == true) {
          if (this.usuarioLogueado.emailVerificado == false) {
            await this.usuarioService.obtenerID(user.email);
            if (this.usuarioService.id) {
              this.usuarioService.update(this.usuarioService.id, { emailVerificado: true });
              this.router.navigate(['/bienvenidos']);
              this.agregarLogIngreso();
            }
          } else {
            this.router.navigate(['/bienvenidos']);
            this.agregarLogIngreso();
          }
        } else {
          this.router.navigate(['/verificacion-registro']);
        }
      }
    } else {
      console.log('Credenciales Incorrectas');
    }
  }

  agregarLogIngreso() {
    let hoy = new Date();
    let fecha = hoy;
    let horario = hoy.getHours() < 10 ? '0' + hoy.getHours() + ':' : hoy.getHours() + ':';
    horario += hoy.getMinutes() < 10 ? '0' + hoy.getMinutes() + ':' : hoy.getMinutes() + ':';
    horario += hoy.getSeconds() < 10 ? '0' + hoy.getSeconds() : hoy.getSeconds();
    let datos = {
      usuario: this.usuarioLogueado.nombre + " " + this.usuarioLogueado.apellido,
      email: this.usuarioLogueado.email,
      fecha: fecha.toDateString(),
      horario: horario,
      idUsuario: this.usuarioLogueado.id,
      tipoUsuario: this.usuarioLogueado.role
    }
    this.usuarioService.agregarLogIngreso("Logs", datos);
  }


  verificarResultadoCaptcha(resultado: boolean) {
    this.captchaOkay = resultado;
  }

  actualizarIdioma() {
    if (this.idiomaSeleccionado === 'esp') {
      this.correo = 'Correo';
      this.iniciarSesion = 'Iniciar Sesion';
      this.contra = 'Contraseña';
      this.errorCaptchaTraducido = 'Debe realizar el captcha';
      this.ingresar = 'Ingresar';
    } else {
      if (this.idiomaSeleccionado === 'por') {
        this.correo = 'o email';
        this.iniciarSesion = 'Iniciar sessão';
        this.contra = 'senha';
        this.errorCaptchaTraducido = 'Você deve fazer o captcha';
        this.ingresar = 'Entrar';
      } else {
        if (this.idiomaSeleccionado === 'ing') {
          this.correo = 'Email';
          this.iniciarSesion = 'Log In';
          this.contra = 'Password';
          this.errorCaptchaTraducido = 'You must do the captcha';
          this.ingresar = 'Submit';
        }
      }
    }
  }
}
