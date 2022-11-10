import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  public userLogged: any;
  public estaLogeado: boolean = false;
  public esAdmin: boolean = false;

  constructor(
    private router:Router,
    private authFire: AngularFireAuth
  ) {  }

  ngOnInit(): void {
    this.authFire.authState.subscribe(res => {
      if (res && res.uid) {
        this.userLogged = res.email;
        this.estaLogeado = true;

        if (this.userLogged == 'fede@admin.com') {
          this.esAdmin = true;
        }

        console.log('User logeado -> ', this.userLogged);
      } else {

        this.estaLogeado = false;
        this.esAdmin = false;

        console.log(' No hay usuario logueado ');
      }
    });
  }


  async logOut(){
    try{
      await this.authFire.signOut();

      this.router.navigateByUrl('/');
  
    }catch(error){ console.log(error); }
  }

}
