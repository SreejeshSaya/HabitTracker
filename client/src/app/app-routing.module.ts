import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component'
import { SignupComponent } from './signup/signup.component';
import {PendingComponent} from './pending/pending.component'
import { AddHabitComponent } from './add-habit/add-habit.component';
import { HabitManageComponent } from './habit/habit-manage/habit-manage.component';

const routes: Routes = [
   {path:"",component:PendingComponent,pathMatch:"full"},
   {path:'login',component:LoginComponent},
   {path:'signup',component:SignupComponent},
   {path:'add-habit',component:AddHabitComponent},
   {path:'habits/:habitId',component:HabitManageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
