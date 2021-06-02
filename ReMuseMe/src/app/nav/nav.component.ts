import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../spotify-api.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private route: ActivatedRoute, private spotifyApi: SpotifyApiService) { }

  ngOnInit(): void {
  }

  async getUser() {
    (await this.spotifyApi.getUserProfile()).subscribe(user => {
      console.log(user)
    })
  }
}
