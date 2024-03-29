import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UtilidadesService } from 'src/app/services/utilidades.service';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent implements OnInit {

  @Output() resultadoCaptcha: EventEmitter<any> = new EventEmitter<any>();
  characters: any = [];
  captcha: string = "";
  captchaParaVerificar: string = "";
  checkBtn = document.querySelector(".check-btn");
  statusTxt = document.querySelector(".status-text");
  captchaResult: boolean = false;
  idiomaSeleccionado: string = '';
  verificar: string = 'Validar captcha';
  placeholder: string = 'Ingresar captcha';


  constructor(private utils: UtilidadesService) {
    this.characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
      'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd',
      'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
      't', 'u', 'v', 'w', 'x', 'y', 'z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.getCaptcha();
  }

  ngOnInit() {
    this.utils.idioma$.subscribe(idioma => {
      console.log('idioma recibido: ', idioma);
      this.idiomaSeleccionado = idioma;
      this.actualizarIdioma();
    });
  }

  getCaptcha() {
    this.captcha = "";
    for (let i = 0; i < 6; i++) { //getting 6 random characters from the array
      let randomCharacter = this.characters[Math.floor(Math.random() * this.characters.length)];
      this.captcha += randomCharacter; //passing 6 random characters inside captcha innerText
    }
  }

  verificarCaptcha() {
    if (this.captcha == this.captchaParaVerificar) {
      this.captchaResult = true;
    } else {
      this.captchaParaVerificar = "";
      this.getCaptcha();
    }
    this.resultadoCaptcha.emit(this.captchaResult);
  }

  actualizarIdioma() {
    if (this.idiomaSeleccionado === 'esp') {
      this.verificar = 'Validar captcha';
      this.placeholder = 'Ingresar captcha';
    } else {
      if (this.idiomaSeleccionado === 'por') {
        this.verificar = 'Validar captcha';
        this.placeholder = 'Digite captcha';
      } else {
        if (this.idiomaSeleccionado === 'ing') {
          this.verificar = 'Validate captcha';
          this.placeholder = 'Enter captcha';
        }
      }
    }
  }
}
