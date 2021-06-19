import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Analytics } from './Interfaces/analytics';
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


  //GET requests
  async getAllSongsNotSwiped(id: number) {
    return this.http.get(`http://localhost:3000/user/${id}/song-data`);
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

  async getUserStats(id: number) {
    return this.http.get(`http://localhost:3000/user-stats/${id}`);
  }

  async getSingleSwipe(userid: number, songid: number) {
    return this.http.get(`http://localhost:3000/user/${userid}/swipes/${songid}`);
  }



  //POST requests
  async postUser(user: User) {
    return this.http.post(`http://localhost:3000/user`, user, this.createJson).subscribe(res => res)
  }

  async postSwipe(swipe: Swipe) {
    return this.http.post(`http://localhost:3000/swipes`, swipe, this.createJson).subscribe(res => res)
  }

  async postSongFromSpotify(song: Analytics) {
    return this.http.post(`http://localhost:3000/song-data`, song, this.createJson).subscribe(res => res)
  }

  //PUT Requests
  async putSwipe(swipe: Swipe, userId: number, id: number) {
    return this.http.put(`http://localhost:3000/user/${userId}/swipes/${id}`, swipe, this.createJson).subscribe(res => res)
  }


}
