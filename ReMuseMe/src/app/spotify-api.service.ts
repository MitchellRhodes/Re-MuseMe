
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {

  constructor(public http: HttpClient) { }

  apiRedirect() {
    return this.http.get("https://accounts.spotify.com/authorize?client_id=&response_type=code&redirect_uri=http://localhost:4200/callback/&scope=streaminguser-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state")
  }
}
