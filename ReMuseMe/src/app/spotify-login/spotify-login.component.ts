import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spotify-login',
  templateUrl: './spotify-login.component.html',
  styleUrls: ['./spotify-login.component.css']
})
export class SpotifyLoginComponent implements OnInit {

  spotifyUrl: string = "https://accounts.spotify.com/authorize?client_id=91f7955d1dba44f4aaac8ad72f54a129&response_type=code&redirect_uri=http://localhost:4200&scope=streaminguser-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

  constructor() { }

  ngOnInit(): void {
  }

  spotifyAuth() {

  }
}
