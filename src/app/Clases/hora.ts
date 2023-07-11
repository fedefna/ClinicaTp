export class Hora {
    hora: string;
    lunes: string = "Libre";
    martes: string = "Libre";
    miercoles: string = "Libre";
    jueves: string = "Libre";
    viernes: string = "Libre";
    sabado: string = "Libre";
    
    constructor(hora:string){
        this.hora=hora;
        if (hora==='15:00' || hora==='15:30' || hora==='16:00' || hora==='16:30' || hora==='17:00' || hora==='17:30' || hora==='18:00' || hora==='18:30') {
            this.sabado='Cerrado';
        }
    }
}