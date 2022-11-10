import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/Clases/user';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-verificacion-registro',
  templateUrl: './verificacion-registro.component.html',
  styleUrls: ['./verificacion-registro.component.css']
})
export class VerificacionRegistroComponent implements OnInit {

  role:string="";

  constructor(private authSvc: AuthService,private usuarioService: UsuariosService) {
    this.authSvc.firebaseAuth.authState.subscribe(res=>{
      if (res && res.uid) {
        console.log('User logeado -> ', res);
      } else {
        console.log(' No hay usuario logueado ');
      }
    });
   }

  ngOnInit(): void {

  }
  

}
