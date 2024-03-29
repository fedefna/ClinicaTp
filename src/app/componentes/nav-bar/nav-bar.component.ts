import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsuariosService } from '../../services/usuarios.service';
import { User } from 'src/app/Clases/user';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  public userLogged: any;
  public estaLogeado: boolean = false;
  public esAdmin: boolean = false;
  public esEspecialista: boolean = false;
  usuarioLogueado = new User();
  idiomaSeleccionado: string = 'esp';
  idiomaParaMostrar: string = 'Def idiomaParaMostrar';
  bienvenidos: string = 'Def bienvenidos';
  gestionUsuarios: string = 'Def gestionUsuarios';
  estadisticas: string = 'Def estadisticas';
  turnos: string = 'Def turnos';
  misTurnos: string = 'Mis Turnos';
  perfil: string = 'Def turnos/perfil-turno';
  solicitarTurno: string = 'Def turnos/solicitar-turno';
  hola: string = 'Hola';
  cerrarSesion: string = 'Def cerrarSesion';
  iniciarSesion: string = 'Def iniciarSesion';
  registrarse: string = 'Def registrarse';
  turnosAdmin: string = 'Def turnos/turnos-admin';
  misPacientes: string = 'Mis pacientes';
  utilidades:any={};


  constructor(
    private router: Router,
    private authFire: AngularFireAuth,
    private authService: AuthService,
    private usuariosService: UsuariosService,
    private utils: UtilidadesService
  ) { }

  ngOnInit(): void {
    this.authFire.authState.subscribe(res => {
      if (res && res.uid) {
        this.userLogged = res.email;
        this.estaLogeado = true;
        console.log('this.userLogged ',this.userLogged,' this.estaLogeado ',this.estaLogeado);
        this.validarRole();
      } else {
        this.estaLogeado = false;
        this.esAdmin = false;
        this.esEspecialista = false;
        console.log('this.estaLogeado ',this.estaLogeado,' this.esAdmin ',this.esAdmin);
      }
    });
    this.actualizarIdioma();
    this.utils.idioma$.subscribe(idioma=>{
      this.idiomaSeleccionado = idioma;
      this.actualizarIdioma();
    });
  }

  navergar(path: string) {
    console.log(' path: ' + path);
    this.router.navigateByUrl(path);
  }

  actualizarIdioma() {
    if (this.idiomaSeleccionado === 'esp') {
      this.utilidades.idioma='esp';
      this.idiomaParaMostrar = 'Idioma: Español';
      this.bienvenidos = 'Bienvenidos';
      this.gestionUsuarios = 'Gestion Usuarios';
      this.estadisticas = 'Estadisticas';
      this.turnos = 'Turnos';
      this.misTurnos = 'Mis Turnos';
      this.misPacientes = 'Mis Pacientes';
      this.perfil = 'Perfil de turnos';
      this.solicitarTurno = 'Solicitar Turno';
      this.hola = 'Hola ';
      this.cerrarSesion = 'Cerrar sesion';
      this.iniciarSesion = 'Iniciar sesion';
      this.registrarse = 'Registrarse';
      this.turnosAdmin = 'Turnos Admin';
    } else {
      if (this.idiomaSeleccionado === 'por') {
        this.utilidades.idioma='por';
        this.idiomaParaMostrar = 'Idioma: Portugues';
        this.bienvenidos = 'Bem-vindo';
        this.gestionUsuarios = 'Gerenciamento de usuários';
        this.estadisticas = 'Estatisticas';
        this.turnos = 'Turnos';
        this.misTurnos = 'Mis Turnos';
        this.perfil = 'perfil de mudança';
        this.misPacientes = 'Meus pacientes';
        this.solicitarTurno = 'Solicitar Turno';
        this.hola = 'Olá ';
        this.cerrarSesion = 'Fechar Sessão';
        this.iniciarSesion = 'Iniciar sessão';
        this.registrarse = 'Registrar';
        this.turnosAdmin = 'Turnos Admin';
      } else {
        if (this.idiomaSeleccionado === 'ing') {
          this.utilidades.idioma='ing';
          this.idiomaParaMostrar = 'Lenguage: English';
          this.bienvenidos = 'Welcome';
          this.gestionUsuarios = 'User Management';
          this.estadisticas = 'Statistics';
          this.turnos = 'Turns';
          this.misTurnos = 'My Turns';
          this.misPacientes = 'My patients';
          this.perfil = 'Shift Profile';
          this.solicitarTurno = 'Request Shift';
          this.hola = 'Hi ';
          this.cerrarSesion = 'Log out';
          this.iniciarSesion = 'Log in';
          this.registrarse = 'Check in';
          this.turnosAdmin = 'Admin Turns';
        }
      }
    }
  }

  cambiarIdioma(idioma: string) {
    this.utilidades.idioma = idioma; 
    this.utils.actualizarIdioma(this.utilidades);
  }

  async logOut() {
    try {
      await this.authFire.signOut();

      this.router.navigateByUrl('/');

    } catch (error) { console.log(error); }
  }

  async validarRole() {
    await this.usuariosService.obtenerUsuario(this.userLogged);
    this.usuarioLogueado = this.usuariosService.usuarioSeleccionado;
    if (this.usuarioLogueado.role === 'admin') {
      this.esAdmin = true;
      this.esEspecialista = false;
      console.log('User logeado es admin-> ', this.usuarioLogueado);
    }else if(this.usuarioLogueado.role === 'especialista') {
      this.esEspecialista = true;
      this.esAdmin=false;
      console.log('User logeado es especialista-> ', this.usuarioLogueado);
    }
  }

}
