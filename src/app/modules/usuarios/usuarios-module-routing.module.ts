import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios/usuarios.component';


const routes: Routes = [{
  path:'',
  children: [
    { path: "usuarios", component: UsuariosComponent},
    { path: "**", redirectTo: "usuarios"}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosModuleRoutingModule { }
