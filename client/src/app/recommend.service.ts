import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable({
   providedIn: 'root',
})
export class RecommendService {
   constructor(private http: HttpClient) {}

   recommend() {
      let sample;
      return this.http.get('/api/get-samples').pipe(
         tap((s) => {
            sample = s;
         }),
         switchMap((_) => {
            return this.http.get('/api/recommend-tags');
         }),
         map((tags: any[]) => {
            const i = Math.floor(Math.random() * tags.length);
            return tags[i];
         }),
         map((tag) => {
            return {
               tag: tag,
               text: sample.tagHabits[tag][0],
            };
         })
      );
   }
}
