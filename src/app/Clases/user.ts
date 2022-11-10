export type Roles = 'paciente' | 'especialista' | 'admin';
export type Especialidades = 'ALERGIA E INMUNOLOGÍA'|'CARDIOLOGIA'|'CIRUGIA DE TORAX'|'CIRUGIA GENERAL'|'CIRUGIA PEDIATRICA'|'CIRUGIA PLASTICA Y REPARADORA'|'CLÍNICA DERMATOLÓGICA'|'DIABETOLOGÍA'|'EPIDEMIOLOGÍA'|'GASTROENTEROLOGíA'|'NEUMONOLOGÍA'|'OFTALMOLOGÍA'|'ONCOLOGÍA'|'ORTOPEDIA Y TRAUMATOLOGÍA'|'OTORRINOLARINGOLOGÍA'|'PATOLOGÍA'|'PEDIATRÍA'|'PSIQUIATRÍA'|'REUMATOLOGÍA'|'UROLOGÍA'
export class User {
    //Pacientes
    uid?: string;
    nombre?: string;
    apellido?: string;
    fechaNaciemiento?: string;
    dni?: number;
    role?: Roles;
    obraSocial?: number;
    email?: string;
    imagenesPaciente1?: string;
    imagenesPaciente2?: string;
    emailVerificado?: boolean;
    id?:string;
    //Especialistas
    especialidad?:Especialidades;
    imageneEspecialista?: string;


    constructor(){
        
    }
}