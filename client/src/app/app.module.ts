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
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileUploadComponent } from './profile-upload/profile-upload.component';
import { StreakCalendarComponent } from './streak-calendar/streak-calendar.component';
import { UserDetailsPublicComponent } from './user-details-public/user-details-public.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component'
import { LoadingComponent } from './loading.component';
import { GraphComponent } from './graph/graph.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TagComponent } from './tag/tag.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
      UserDetailsComponent,
      EditProfileComponent,
      ProfileUploadComponent,
      StreakCalendarComponent,
      UserDetailsPublicComponent,
      LeaderboardComponent,
      LoadingComponent,
      GraphComponent,
      StatisticsComponent,
      TagComponent
   ],
   imports: [
      CommonModule,
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
   ],
   providers: [],
   bootstrap: [AppComponent],
})
export class AppModule {}
