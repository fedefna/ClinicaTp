import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appColorRandom]'
})
export class ColorRandomDirective {

  constructor(private el:ElementRef) { 
    this.changeColor(el);
  }

  private changeColor(el:ElementRef) {
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    this.el.nativeElement.style.borderColor = "#" + randomColor;
  }
}
