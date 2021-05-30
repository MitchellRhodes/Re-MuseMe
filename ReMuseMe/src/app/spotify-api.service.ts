
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as sha256 from 'sha256'


@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {


  constructor(public http: HttpClient) { }

  //to randomize for code challenge
  random() {
    const crypto = window.crypto;

    let typedArray = new Uint8Array(10);

    crypto.getRandomValues(typedArray);

    return typedArray
  }

  //redirect to spotify auth with constructed uri
  apiRedirect() {
    const random = this.random();

    const codeChallenge = sha256(random.toString())

    return window.location.href = `https://accounts.spotify.com/authorize?client_id=91f7955d1dba44f4aaac8ad72f54a129&response_type=code&redirect_uri=http://localhost:4200/spotify-callback/&code_challenge_method=S256&code_challenge=${codeChallenge}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`
  }

  getAccessToken(code: string) {
    return this.http.post('https://accounts.spotify.com/api/token', { grant_type: 'authorization_code', code: code, redirect_uri: 'http://localhost:4200/spotify-callback/' }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }

    )
  }

}


