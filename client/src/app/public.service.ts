import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor(private http: HttpClient) { }

  getPublicProfile(userId){
     return this.http.get(`/api/user-public-data?userId=${userId}`)
     .pipe(
        map((publicProfile: any)=>{
           publicProfile.habits.forEach(habit=>{
              habit.history.forEach(h=>{
                 h.date = new Date(h.date) //replace string date with date object. Same thing is done in habit.service populateHabit
              })
           })
          
           return publicProfile
        })
     )
  }

  getLeaderboard(){
     return this.http.get('/api/leaderboard')
  }

}
