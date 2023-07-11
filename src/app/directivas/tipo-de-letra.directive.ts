import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appTipoDeLetra]'
})
export class TipoDeLetraDirective {

  constructor(private el:ElementRef) { 
    this.changeWeight(this.el);
  }
  
  changeWeight(el:ElementRef){
    this.el.nativeElement.style.fontFamily = 'Impact';
  }

}
