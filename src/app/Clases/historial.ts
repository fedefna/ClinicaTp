export class Historial {
    pacienteId: string;
    especialistaId: string;
    paciente: string;
    especialista: string;
    fecha: string;
    hora:string;
    especialidad:string;
    id:string;
    altura:string;
    peso:string;
    temperatura:string;
    presion:string;
    comentarios:any = [];
    
    
    constructor(pacienteId: string,especialistaId: string,fecha: string,hora:string,especialidad:string, paciente: string,especialista: string
        ,altura: string,peso: string,temperatura: string,presion: string,comentarios: any){
        this.pacienteId=pacienteId;
        this.especialistaId=especialistaId;
        this.paciente=paciente;
        this.hora=hora;
        this.especialidad=especialidad;
        this.especialista=especialista;
        this.fecha=fecha;
        this.id='';
        this.altura=altura+ " mts";
        this.peso=peso+ " kg";
        this.temperatura=temperatura+ "°";
        this.presion=presion;
        this.comentarios=comentarios;
    }
}