import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../spotify-api.service';

@Component({
  selector: 'app-spotify-callback',
  templateUrl: './spotify-callback.component.html',
  styleUrls: ['./spotify-callback.component.css']
})
export class SpotifyCallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute, private spotifyApi: SpotifyApiService) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      console.log(queryParams)
      this.spotifyApi.getAccessToken(queryParams.code).subscribe(accessToken => {
        console.log(accessToken)
      })
    })
  }

}
