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
import { GraphComponent } from './graph/graph.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TagComponent } from './tag/tag.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';

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
      GraphComponent,
      StatisticsComponent,
      TagComponent,
      SidebarComponent      
   ],
   imports: [
      CommonModule,
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      MatToolbarModule,
      MatButtonModule,
      MatProgressSpinnerModule,
      MatFormFieldModule,
      MatInputModule,
      MatCardModule,
      MatCheckboxModule,
      MatSidenavModule,
      MatIconModule,
      MatDatepickerModule,
      MatChipsModule
   ],
   providers: [],
   bootstrap: [AppComponent],
})
export class AppModule {}
