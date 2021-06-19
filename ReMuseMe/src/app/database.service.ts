import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Swipe } from './Interfaces/swipe';
import { User } from './Interfaces/user';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  createJson = {
    headers: new HttpHeaders({ 'Content-type': 'application/json' })
  }

  constructor(private http: HttpClient) { }

  async getAllSongsNotSwiped(id: number) {
    return this.http.get(`https://api.swipify.me/user/${id}/song-data`);
  }

  async postSwipe(swipe: Swipe) {
    return this.http.post(`https://api.swipify.me/swipes`, swipe, this.createJson).subscribe(res => console.log(res))
  }

  async putSwipe(swipe: Swipe, userId: number, id: number) {
    return this.http.put(`https://api.swipify.me/user/${userId}/swipes/${id}`, swipe, this.createJson).subscribe(res => console.log(`put swipe`, res))
  }

  async getUsers() {
    return this.http.get(`https://api.swipify.me/user`);
  }

  async getUser(email: string) {

    return this.http.get(`https://api.swipify.me/user/${email}`);
  }

  async changeSongStringIdToNumber(id: string) {
    return this.http.get(`https://api.swipify.me/song/${id}`);
  }

  async postUser(user: User) {
    return this.http.post(`https://api.swipify.me/user`, user, this.createJson).subscribe(res => console.log(`service`, res))
  }

  async getUserStats(id: number) {
    return this.http.get(`https://api.swipify.me/user-stats/${id}`);
  }

}
