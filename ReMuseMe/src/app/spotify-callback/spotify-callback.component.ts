import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SpotifyApiService } from '../spotify-api.service';

@Component({
  selector: 'app-spotify-callback',
  templateUrl: './spotify-callback.component.html',
  styleUrls: ['./spotify-callback.component.css']
})
export class SpotifyCallbackComponent implements OnInit {

  album: Observable<object> | null = null;
  query: string | null = null;


  constructor(private route: ActivatedRoute, private spotifyApi: SpotifyApiService) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      console.log(queryParams)
      this.spotifyApi.getAccessToken(queryParams.code)
    })
  }

  async getUser() {
    (await this.spotifyApi.getUserProfile()).subscribe(user => {
      console.log(user)
    })
  }

  async getAlbum() {
    (await this.spotifyApi.getAlbum()).subscribe(album => {
      console.log(album)
    })
  }

  async getArtists() {
    (await this.spotifyApi.getSeveralArtists()).subscribe(artists => {
      console.log(artists)
    })
  }

  async search() {
    (await this.spotifyApi.searchBar(this.query)).subscribe(search => {
      console.log(search);
    })
  }

}
