import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  rol?:string="";
  constructor(private authSvc: AuthService,private usuarioService: UsuariosService,private router: Router) {
    
  }

  ngOnInit(): void {
    if (this.usuarioService.usuarioSeleccionado.emailVerificado===false) {
      console.log("constructor de verRegis... this.usuarioService.usuarioSeleccionado.role:"+this.usuarioService.usuarioSeleccionado.role);
      this.rol=this.usuarioService.usuarioSeleccionado.role;
      this.authSvc.LogOut().then();
    }else{
      this.router.navigate(['/bienvenidos']);
    } 
  }
  

}
