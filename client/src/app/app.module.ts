import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HabitFilter,PendingComponent } from './pending/pending.component';
import { HabitSmallComponent } from './habit/habit-small/habit-small.component';
import { AddHabitComponent } from './add-habit/add-habit.component';
import { HabitManageComponent } from './habit/habit-manage/habit-manage.component';
import * as dateManager from './dateManager';
import { ColorPickerComponent } from './color-picker/color-picker.component'

@NgModule({
   declarations: [
      AppComponent,
      NavbarComponent,
      LoginComponent,
      SignupComponent,
      PendingComponent,
      HabitSmallComponent,
      AddHabitComponent,
      HabitManageComponent,
      HabitFilter,
      ColorPickerComponent,
   ],
   imports: [
      CommonModule,
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
   ],
   providers: [],
   bootstrap: [AppComponent],
})
export class AppModule {}
