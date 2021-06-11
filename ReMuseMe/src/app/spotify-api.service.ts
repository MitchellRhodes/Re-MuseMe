
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, windowToggle } from 'rxjs/operators';
import * as sha256 from 'sha256';
import { PlaylistItems } from './Interfaces/playlist-items';
import { Posts } from './Interfaces/posts';




@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {



  static accessToken: string | null = null;
  static refreshToken: string | null = null;
  static expiresIn: number | null = null;

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
  getAccessToken(code: string, redirect: string) {
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
        localStorage.setItem('accessToken', accessToken.access_token);

        SpotifyApiService.refreshToken = accessToken.refresh_token;
        localStorage.setItem('refreshToken', accessToken.refresh_token);

        SpotifyApiService.expiresIn = accessToken.expires_in;


        window.location.href = redirect;
      })
  }

  returnAccessToken() {
    return SpotifyApiService.accessToken;
  }



  tokenRefresh() {

    let refreshToken = localStorage.getItem('refreshToken')

    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', `${refreshToken}`)
      .set('client_id', '91f7955d1dba44f4aaac8ad72f54a129')

    return this.http.post(`https://accounts.spotify.com/api/token`, body.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    })
      .subscribe((accessToken: any) => {
        console.log(accessToken);

        SpotifyApiService.accessToken = accessToken.access_token;
        localStorage.setItem('accessToken', accessToken.access_token);

        SpotifyApiService.refreshToken = accessToken.refresh_token;
        localStorage.setItem('refreshToken', accessToken.refresh_token);

        SpotifyApiService.expiresIn = accessToken.expires_in;
      })
  }







  private getHeaders() {

    console.log(SpotifyApiService.accessToken)


    if (SpotifyApiService.accessToken === null) {

      let accessToken = localStorage.getItem('accessToken')

      console.log(accessToken)


      if (accessToken === null) {
        console.log('Bad Token')

        this.tokenRefresh();

      } else {
        SpotifyApiService.accessToken = accessToken;
      }
    }
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

    let url = new URL(`https://api.spotify.com/v1/search`)
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

    if (value === 'any') {
      url.searchParams.set('type', 'artist,album,track,playlist')
    }

    return this.http.get(url.toString().replace('+', '%20'), headers)

  }



  async browseCategories() {
    const headers = this.getHeaders();

    return this.http.get(`https://api.spotify.com/v1/browse/categories?limit=50`, headers)
  }


  async browseCategory(id: string | null): Promise<any> {
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


  async getSeveralArtists(ids: string[] = []) {
    const headers = this.getHeaders();
    let url = new URL(`https://api.spotify.com/v1/artists`)
    let query: string = '';
    for (let id of ids) {
      query = `${query}${id},`;
    }
    url.searchParams.set('ids', `${ids}`)

    //this one takes multiple ids
    return this.http.get(query.replace('+', '%20'), headers);
  }


  async getArtist(id: string | null): Promise<any> {
    const headers = this.getHeaders();

    return this.http.get(`https://api.spotify.com/v1/artists/${id}`, headers);
  }



  //album related calls

  async getMultipleAlbums() {
    const headers = this.getHeaders();

    //this also needs to be able to take multiple ids
    return this.http.get(`https://api.spotify.com/v1/albums`, headers);
  }

  async getAlbum(id: string) {
    const headers = this.getHeaders();


    return this.http.get(`https://api.spotify.com/v1/albums/${id}`, headers);
  }


  async getAlbumTracks(id: string) {
    const headers = this.getHeaders();

    return this.http.get(`https://api.spotify.com/v1/albums/${id}/tracks`, headers)
  }





  //tracks related calls

  async getSeveralTracks(ids: string[]) {
    const headers = this.getHeaders();

    let url = new URL(`https://api.spotify.com/v1/tracks`)
    let query: string = '';
    // for (let id of ids) {
    //   query = query + id + '%2C'
    //   // query = `${query}${id},`;
    // }
    query = ids.join('%2C')
    // console.log(ids)

    // url.searchParams.set('ids', `${ids}`)
    // console.log(query)

    //this one takes multiple ids
    return this.http.get(`${url}?ids=${query}`, headers) as Observable<any>;
  }


  async getATrack(id: string | null): Promise<any> {
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

  // we have to use this to get tracks


  async getRecommendations(seed: string) {
    const headers = this.getHeaders();
    let url = new URL(`https://api.spotify.com/v1/recommendations`)
    url.searchParams.set('seed_genres', seed);
    // url.searchParams.set('seed_tracks', '');


    return this.http.get(url.toString().replace('+', '%20'), headers)
  }

  //playlist related calls

  async getUserPlaylists() {
    const headers = this.getHeaders();

    return this.http.get(`https://api.spotify.com/v1/me/playlists`, headers)
  }

  createPlaylist(playlist: Posts, userId: string) {
    const headers = this.getHeaders();
    return this.http.post(`https://api.spotify.com/v1/users/${userId}/playlists`, playlist, headers)
  }


  addItemsToPlaylist(id: string) {
    const headers = this.getHeaders();
    return this.http.post(`https://api.spotify.com/v1/playlists/${id}/tracks`, headers)
  }


  async replaceItemInPlaylist(playlistId: string, item: PlaylistItems) {
    const headers = this.getHeaders();
    return this.http.put(`https://api.spotify.com/v1/playlists/${playlistId}`, item, headers)
  }


  async changePlaylistDetails(playlist: Posts, playlistId: string) {
    const headers = this.getHeaders();
    return this.http.put(`https://api.spotify.com/v1/playlists/${playlistId}`, playlist, headers)
  }

  //send playlist id in 
  removeItemFromPlaylist(id: string) {
    const headers = this.getHeaders();

    return this.http.delete(`https://api.spotify.com/v1/playlists/${id}/tracks`, headers)

  }

}
