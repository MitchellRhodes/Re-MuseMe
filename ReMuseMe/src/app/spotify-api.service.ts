
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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



  sha256(plain: string) {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)

    return window.crypto.subtle.digest('SHA-256', data)
  }

  base64urlencode(a: any) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(a) as any)
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''))
  }




  //redirect to spotify auth with constructed uri
  async apiRedirect() {

    const random = this.random();

    const hashed = await this.sha256(random.toString())
    const codeChallenge = this.base64urlencode(hashed)

    localStorage.setItem('codeChallenge', codeChallenge);


    return window.location.href = `https://accounts.spotify.com/authorize?client_id=91f7955d1dba44f4aaac8ad72f54a129&response_type=code&redirect_uri=http://localhost:4200/spotify-callback/&code_challenge_method=S256&code_challenge=${codeChallenge}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`
  }

  getAccessToken(code: string) {
    const codeChallenge = localStorage.getItem('codeChallenge')

    if (!codeChallenge) {
      return this.apiRedirect()
    }

    const body = new HttpParams()
      .set('client_id', '91f7955d1dba44f4aaac8ad72f54a129')
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', 'http://localhost:4200/spotify-callback/')
      .set('code_verifier', codeChallenge)

    console.log(codeChallenge)

    return this.http.post(`https://accounts.spotify.com/api/token`, body.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }

    ).subscribe(accessToken => {
      console.log(accessToken)

    })
  }

}


