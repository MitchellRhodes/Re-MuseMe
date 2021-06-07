import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from '../spotify-api.service';

@Component({
  selector: 'app-spotify-login-page',
  templateUrl: './spotify-login-page.component.html',
  styleUrls: ['./spotify-login-page.component.css']
})
export class SpotifyLoginPageComponent implements OnInit {

  constructor(private service: SpotifyApiService) { }

  ngOnInit(): void {
  }

  //This is how we redirect the user to the spotify authentication page if they didn't already login 
  // with spotify

  spotifyAuth() {
    this.service.apiRedirect();
  }

}
