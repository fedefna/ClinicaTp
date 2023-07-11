import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { myAnimations } from './route-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    myAnimations,
  ]
})
export class AppComponent {
  title = 'ClinicaTp';
  prepareRoute(outlet:RouterOutlet){
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
