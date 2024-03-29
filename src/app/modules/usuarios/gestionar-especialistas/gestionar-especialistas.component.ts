import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/Clases/user';
import { ExcelService } from 'src/app/services/excel.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';

@Component({
  selector: 'app-gestionar-especialistas',
  templateUrl: './gestionar-especialistas.component.html',
  styleUrls: ['./gestionar-especialistas.component.css']
})
export class GestionarEspecialistasComponent implements OnInit {

  users$: Observable<User[]>;
  user?: User;
  listaDeExcel:User[] = [];
  captcha: boolean = false;
  utilidades:any={};

  constructor(private usuariosServ: UsuariosService,private excelService:ExcelService,private utils: UtilidadesService) {
    this.users$ = this.usuariosServ.usuariosRef.valueChanges();
    this.usuariosServ.usuariosRef.valueChanges().subscribe((data: any) => {
      this.listaDeExcel = [];
      let usuario:User;
      data.forEach((user: User) => {
        if (user.role === 'paciente') {
          usuario = {
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            fechaNaciemiento: user.fechaNaciemiento,
            dni: user.dni,
            role: user.role,
            obraSocial: user.obraSocial,
          }
        } else if (user.role === 'especialista') {
          usuario = {
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            fechaNaciemiento: user.fechaNaciemiento,
            dni: user.dni,
            role: user.role,
            especialidades: user.especialidades,
          }
        }
        this.listaDeExcel.push(usuario);
      });
    });
  }
  
  ngOnInit(): void {
    this.utils.captcha$.subscribe(captcha=>{
      console.log('captcha recibido: ',captcha);
      this.captcha = captcha;
    });
  }

  habilitarEspecialista(user: User) {
    if (user.id != undefined) {
      this.usuariosServ.update(user.id, { emailVerificado: true });
    }
  }

  deshabilitarEspecialista(user: User) {
    if (user.id != undefined) {
      this.usuariosServ.update(user.id, { emailVerificado: false });
    }
  }

  descargarExcel() {
    this.excelService.descargarExcelUsuarios(this.listaDeExcel, 'Lista Usuarios');
  }

  cambiarCaptcha(){
    if(this.captcha){
      this.utilidades.captcha = false; 
    }else{
      this.utilidades.captcha = true; 
    }
    this.utils.actualizarCaptcha(this.utilidades);

  }

}
