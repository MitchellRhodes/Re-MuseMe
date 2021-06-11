import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Profile } from '../Interfaces/profile';
import { SpotifyApiService } from '../spotify-api.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private route: ActivatedRoute, private spotifyApi: SpotifyApiService) { }

  userProfile: Profile | null = null;

  //This is how we get all the user profile information from the spotify api to generate on the user-profile
  //page -Ami

  async ngOnInit(): Promise<void> {
    (await this.spotifyApi.getUserProfile()).subscribe((response: any) => {
      this.userProfile = response;
    })
  }


  //This is how we redirect them to the login page if they're not authenticated. I'm trying to figure
  //out how to have everything on one page instead of having the user constantly be redirected
  // would like to make the whole app a single-page app - Ami


  async getUser() {
    (await this.spotifyApi.getUserProfile()).subscribe(user => {

    },
      (error) => {
        window.location.href = "/login"
      });

  }




}
