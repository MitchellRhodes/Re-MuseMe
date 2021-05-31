
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import base64url from "base64url";
import * as sha256 from 'sha256'


@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {


  constructor(public http: HttpClient) { }


  //to randomize code verifier to be used in challenge
  random() {
    return window.btoa(Array.from(window.crypto.getRandomValues(new Uint8Array(length * 2))).map((b) => String.fromCharCode(b)).join("")).replace(/[+/]/g, "").substring(0, length);

  }


  //more encoding for code challenge
  async sha256(str: string) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
  }

  base64urlencode(a: any) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(a) as any)
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''))
  }





  //redirect to spotify auth with constructed uri. This calls random to randomize , then it gets hashed by sha256, then stored in codeChallenge and base64URLencoded.
  //Then I pass the codechallenge variable so that it can be used outside of the function for the post where it requires a code verifier in the uri to know that it is the same sender as before
  async apiRedirect() {

    const codeVerifier = this.random();
    const codeChallenge = this.base64urlencode(await this.sha256(codeVerifier));



    // const random = this.random();

    // const hashed = await this.sha256(random.toString())
    // const codeChallenge = this.base64urlencode(hashed)


    console.log(`codeVerifier ${codeVerifier}`)
    console.log(`code challenge ${codeChallenge}`)

    // code challenge is getting lost in the redirect
    localStorage.setItem('codeVerifier', codeVerifier);


    return window.location.href = `https://accounts.spotify.com/authorize?client_id=91f7955d1dba44f4aaac8ad72f54a129&response_type=code&redirect_uri=http://localhost:4200/spotify-callback/&code_challenge_method=S256&code_challenge=${codeChallenge}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`
  }




  //gets access token, brings in the codechallenge for the verifier part of the uri, const body sets the uri params for the post, you call it to string so it can be used as a url,then
  //the header is to let it know the content is encoded
  getAccessToken(code: string) {
    const codeVerifier = localStorage.getItem('codeVerifier')

    console.log(`${codeVerifier}`)

    if (!codeVerifier) {
      return this.apiRedirect()
    }

    const body = new HttpParams()
      .set('client_id', '91f7955d1dba44f4aaac8ad72f54a129')
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', 'http://localhost:4200/spotify-callback/')
      .set('code_verifier', codeVerifier)


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


