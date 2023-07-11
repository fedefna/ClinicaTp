
export class Turno {
    pacienteId: string;
    especialistaId: string;
    paciente: string;
    especialista: string;
    fecha: string;
    estado: string;
    comentarioPaciente:string;
    comentarioEspecialista:string;
    comentarioCalificacion:string;
    hora:string;
    especialidad:string;
    id:string;
    encuesta:boolean;


    constructor(pacienteId: string,especialistaId: string,fecha: string,hora:string,especialidad:string, paciente: string,especialista: string){
        this.pacienteId=pacienteId;
        this.especialistaId=especialistaId;
        this.paciente=paciente;
        this.especialista=especialista;
        this.fecha=fecha;
        this.id='';
        this.encuesta=false;
        this.comentarioCalificacion='';
        this.estado='creado';
        this.comentarioEspecialista='';
        this.comentarioPaciente='';
        this.hora=hora;
        this.especialidad=especialidad;
    }
}
 