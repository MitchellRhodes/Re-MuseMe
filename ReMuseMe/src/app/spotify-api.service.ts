
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import * as sha256 from 'sha256';
import { Observable } from 'rxjs';
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

  async searchBar(input: any, value: any) {
    const headers = this.getHeaders();

    const url = new URL(`https://api.spotify.com/v1/search`)
    url.searchParams.set('q', `${input}`)

    //create if statements for each of these based on selection drop down
    if (value === 'artist') {
      url.searchParams.set('type', `artist`)
    }

    if (value === 'album') {
      url.searchParams.set('type', `album`)
    }


    if (value === 'track') {
      url.searchParams.set('type', `track`)
    }


    return this.http.get(url.toString().replace('+', '%20'), headers)

  }



  async browseCategories() {
    const headers = this.getHeaders();

    return this.http.get(`https://api.spotify.com/v1/browse/categories?limit=50`, headers)
  }


  async browseCategory(id: string) {
    const headers = this.getHeaders();

    return this.http.get(`https://api.spotify.com/v1/browse/categories/${id}`, headers)
  }


  async browseRecommendedGenres() {
    const headers = this.getHeaders();

    return this.http.get(`https://api.spotify.com/v1/recommendations/available-genre-seeds`, headers)
  }


  async getRecommendsBasedOnSeeds() {
    const headers = this.getHeaders();
    //this one may be really complicated and based on our match game, so we will leave it for now
  }

  //user related calls


  async getUserProfile() {
    const headers = this.getHeaders();
    return this.http.get(`https://api.spotify.com/v1/me`, headers);
  };



  //artist related calls


  async getSeveralArtists() {
    const headers = this.getHeaders();

    //this one takes multiple ids
    return this.http.get(`https://api.spotify.com/v1/artists`, headers);
  }


  async getArtist(id: string) {
    const headers = this.getHeaders();

    return this.http.get(`https://api.spotify.com/v1/artists/${id}`, headers);
  }



  //album related calls

  async getMultipleAlbums() {
    const headers = this.getHeaders();

    //this also needs to be able to take multiple ids
    return this.http.get(`https://api.spotify.com/v1/albums`, headers)
  }

  async getAlbum() {
    const headers = this.getHeaders();

    return this.http.get(`https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj`, headers);
    // return this.http.get(`https://api.spotify.com/v1/albums/${id}`, headers)
  }


  async getAlbumTracks(id: string) {
    const headers = this.getHeaders();

    return this.http.get(`https://api.spotify.com/v1/albums/${id}/tracks`, headers)
  }





  //tracks related calls

  async getSeveralTracks() {
    const headers = this.getHeaders();

    //this also needs to be able to take multiple ids
    return this.http.get(`https://api.spotify.com/v1/tracks`, headers)
  }


  async getATrack(id: string) {
    const headers = this.getHeaders();

    return this.http.get(`https://api.spotify.com/v1/tracks/${id}`, headers)
  }


  async getAudioFeaturesForMultipleTracks() {
    const headers = this.getHeaders();

    //this also needs to be able to take multiple ids
    return this.http.get(`https://api.spotify.com/v1/audio-features`, headers)
  }


  async getAudioFeaturesForATrack(id: string) {
    const headers = this.getHeaders();

    return this.http.get(`https://api.spotify.com/v1/audio-features/${id}`, headers)
  }


  //playlist related calls

  async getUserPlaylists() {
    const headers = this.getHeaders();

    return this.http.get(`https://api.spotify.com/v1/me/playlists`, headers)
  }

  async createPlaylist() {
    const headers = this.getHeaders();
    //POST
  }


  async addItemsToPlaylist() {
    const headers = this.getHeaders();
    //POST

  }


  async replaceItemInPlaylist() {
    const headers = this.getHeaders();
    //PUT
  }


  async changePlaylistDetails() {
    const headers = this.getHeaders();
    //PUT
  }


  async removeItemFromPlaylist() {
    const headers = this.getHeaders();
    //DELETE
  }
}
