import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UsuariosService } from '../services/usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authSvc: AuthService,
    private usuarioService: UsuariosService,
    private router: Router
  ) { }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authSvc.getAuthState().pipe(map(aux => {
        console.log(aux);
        if (aux!=null && aux.email) {
          console.log("primero: "+this.usuarioService.usuarioSeleccionado);
          // this.usuarioService.obtenerRole(aux.email);
          if (this.usuarioService.usuarioSeleccionado.role==='admin') {
            return true;
          }else{
            this.router.navigate(['/bienvenida']);
            return false;
          }
        }
        else {
          return false;
        }
      }));
  }
  
}
