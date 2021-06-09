import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Analytics } from './Interfaces/analytics';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) { }


  async getAllSongs() {

    return this.http.get(`http://localhost:3000/song-data`) as Observable<Analytics[]>;
  };
}
