import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appColorPorUsuario]'
})
export class ColorPorUsuarioDirective {

  @Input() appColorPorUsuario:string = "";
  constructor(private el:ElementRef) { 
  }

  ngOnInit(){
    this.changeColor(this.el);
  }

  private changeColor(el:ElementRef) {
    switch(this.appColorPorUsuario){
      case 'admin':
        this.el.nativeElement.style.color = '#f23a3a';
        break;
      case 'paciente':
        this.el.nativeElement.style.color = '#3cb1b5';
        break;
      case 'especialista':
        this.el.nativeElement.style.color = '#3535b5'; 
        break;
    }
   
  }

}
