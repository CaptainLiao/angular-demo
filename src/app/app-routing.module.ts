import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HeroesComponent } from './heroes/heroes.component';
import { ClockComponent } from "./clock/clock.component";

const routes: Routes = [
  { path: 'heroes', component: HeroesComponent },
  { path: 'clock', component: ClockComponent },
];


@NgModule({
  exports: [RouterModule],
  imports: [ RouterModule.forRoot(routes,
    //{ enableTracing: true } // <-- debugging purposes only) 
  )],
})
export class AppRoutingModule { }
