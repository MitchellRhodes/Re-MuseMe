import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../spotify-api.service';
import { Tracks } from '../Interfaces/tracks';
import { Recommendations } from '../Interfaces/recommendations';

@Component({
  selector: 'app-matchmaker',
  templateUrl: './matchmaker.component.html',
  styleUrls: ['./matchmaker.component.css']
})
export class MatchmakerComponent implements OnInit {
  track: Tracks | null = null;
  trackArray: Tracks [] | null = null;
  recommended: Recommendations | null = null;

  constructor(private route: ActivatedRoute, private spotifyApi: SpotifyApiService) { }

  async ngOnInit(): Promise<void> {
    (await this.spotifyApi.getATrack('4cOdK2wGLETKBW3PvgPWqT')).subscribe((response: any) => {
        this.track = response
        this.startPlayer(response.uri)
        console.log(response)
    });    
    (await this.spotifyApi.getRecommendations()).subscribe((response: any) => {
      this.recommended = response
      // this.startPlayer(response.uri)
      console.log(response)
  }); 
  }
  

  async startPlayer(uri: string): Promise<void> {
    (await this.spotifyApi.playerPlay(uri)).subscribe((response: any) => {
      console.log(response)
    })
  }
}
