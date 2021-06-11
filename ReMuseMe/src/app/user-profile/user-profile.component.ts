import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../spotify-api.service';
import { Profile } from '../Interfaces/profile'
import { TracksLikedDislikedService } from '../Services/tracks-liked-disliked.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userProfile: Profile | null = null;


  constructor(private route: ActivatedRoute, 
    private spotifyApi: SpotifyApiService,
    private trackslikeddislikedService: TracksLikedDislikedService) { }

  //This is how we are getting any of the users spotify profile information

   async ngOnInit(): Promise<void> {
     (await this.spotifyApi.getUserProfile()).subscribe((response: any) => {
       this.userProfile = response;
       console.log(response)
     })
  }


  

}
