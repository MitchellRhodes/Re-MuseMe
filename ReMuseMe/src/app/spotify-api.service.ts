
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import * as sha256 from 'sha256';
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi();


@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {


  static accessToken: string | null = null;

  createJson = {
    headers: new HttpHeaders({ 'Content-type': 'application/json' })
  }

  constructor(public http: HttpClient) { }

  //to randomize code verifier to be used in challenge
  random() {
    const length = 50;
    return window.btoa(Array.from(window.crypto.getRandomValues(new Uint8Array(length * 2))).map((b) => String.fromCharCode(b)).join("")).replace(/[+/]/g, "").substring(0, length);
  }

  //to hash the code verifier and turn it into code challenge
  async sha256(plain: string) {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
  }

  base64urlencode(a: any) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(a) as any))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }



  //redirect to spotify auth with constructed uri. This calls random to randomize , then it gets hashed by sha256, then stored in codeChallenge and base64URLencoded.
  //Then I pass the codechallenge variable so that it can be used outside of the function for the post where it requires a code verifier in the uri to know that it is the same sender as before
  async apiRedirect() {
    const codeVerifier = this.random();

    const sha = await this.sha256(codeVerifier);

    const codeChallenge = this.base64urlencode(sha);

    localStorage.setItem('codeVerifier', codeVerifier);
    return window.location.href = `https://accounts.spotify.com/authorize?client_id=91f7955d1dba44f4aaac8ad72f54a129&response_type=code&redirect_uri=http://localhost:4200/spotify-callback/&code_challenge_method=S256&code_challenge=${codeChallenge}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`
  }




  //gets access token, brings in the codechallenge for the verifier part of the uri, const body sets the uri params for the post, you call it to string so it can be used as a url,then
  //the header is to let it know the content is encoded
  getAccessToken(code: string) {
    const codeVerifier = localStorage.getItem('codeVerifier')

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
    })
      .subscribe((accessToken: any) => {
        console.log(accessToken);
        SpotifyApiService.accessToken = accessToken.access_token;
        // spotifyApi.setAccessToken = accessToken.access_token;

      })
  }



  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${SpotifyApiService.accessToken}`
      })
    };
  }



  //search related calls

  async searchBar(input: any) {
    const headers = this.getHeaders();

    const url = new URL(`https://api.spotify.com/v1/search`)
    url.searchParams.set('q', `${input}`)
    url.searchParams.set('type', `artist`)
    return this.http.get(url.toString().replace('+', '%20'), headers)

  }

  async browseCategories() {
    const headers = this.getHeaders();
  }


  async browseCategory() {
    const headers = this.getHeaders();
  }


  async browseRecommendedGenres() {
    const headers = this.getHeaders();
  }

  //user related calls


  async getUserProfile() {
    const headers = this.getHeaders();
    return this.http.get(`https://api.spotify.com/v1/me`, headers);
  };



  //artist related calls


  async getSeveralArtists() {
    const headers = this.getHeaders();

    return this.http.get(`https://api.spotify.com/v1/artists`, headers);
  }


  async getArtist() {
    const headers = this.getHeaders();
  }



  //album related calls

  async getMultipleAlbums() {
    const headers = this.getHeaders();
  }

  async getAlbum() {
    const headers = this.getHeaders();

    return this.http.get(`https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj`, headers);
    // return this.http.get(`https://api.spotify.com/v1/albums/${id}`, headers)
  }


  //tracks related calls

  async getSeveralTracks() {
    const headers = this.getHeaders();
  }


  async getATrack() {
    const headers = this.getHeaders();
  }


  async getAudioFeaturesForMultipleTracks() {
    const headers = this.getHeaders();
  }


  async getAudioFeaturesForATrack() {
    const headers = this.getHeaders();
  }


  //playlist related calls

  async createPlaylist() {
    const headers = this.getHeaders();
  }

  async getUserPlaylists() {
    const headers = this.getHeaders();
  }


  async addItemsToPlaylist() {
    const headers = this.getHeaders();
  }


  async replaceItemInPlaylist() {
    const headers = this.getHeaders();
  }


  async removeItemFromPlaylist() {
    const headers = this.getHeaders();
  }
}
