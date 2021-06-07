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

    //This is currently getting the track by id, I have it hard coded right now just to see exactly how
    //the match maker component would look with everything on it. Will be getting rid of it with the 
    // call below, getRecommendations - Ami

    (await this.spotifyApi.getATrack('6S41USppfhF2c9xuNx97AN')).subscribe((response: any) => {
        this.track = response
        console.log(response)
    }); 

    //This is how the match maker will pull songs based on the seed_genres they select on the category page
    //they will have to atleast choose one in order for the api to pull any recommendations. It's a little
    //messy, I am still working on how to get the seed_genres they pick that got put into a new array to
    //this function. - Ami


    (await this.spotifyApi.getRecommendations()).subscribe((response: any) => {
      this.recommended = response
      // this.startPlayer(response.uri)
      console.log(response)
  }); 
  }
  

}
