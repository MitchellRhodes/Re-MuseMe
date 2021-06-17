import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this.http.get(`http://localhost:3000/user/${id}/song-data`);
  }

  async postSwipe(swipe: Swipe) {
    return this.http.post(`http://localhost:3000/swipes`, swipe, this.createJson).subscribe(res => console.log(res))
  }

  async putSwipe(swipe: Swipe, userId: number, id: number) {
    return this.http.put(`http://localhost:3000/user/${userId}/swipes/${id}`, swipe, this.createJson).subscribe(res => console.log(`put swipe`, res))
  }

  async getUsers() {
    return this.http.get(`http://localhost:3000/user`);
  }

  async getUser(email: string) {

    return this.http.get(`http://localhost:3000/user/${email}`);
  }

  async changeSongStringIdToNumber(id: string) {
    return this.http.get(`http://localhost:3000/song/${id}`);
  }

  async postUser(user: User) {
    return this.http.post(`http://localhost:3000/user`, user, this.createJson).subscribe(res => console.log(`service`, res))
  }

  async getUserStats(id: number) {
    return this.http.get(`http://localhost:3000/user-stats/${id}`);
  }

}
