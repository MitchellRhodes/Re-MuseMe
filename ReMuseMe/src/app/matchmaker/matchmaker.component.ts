import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../spotify-api.service';
import { Tracks } from '../Interfaces/tracks';
import { Recommendations } from '../Interfaces/recommendations';
import { CategorySelectedService } from '../Services/category-selected.service';
import { Browse } from '../Interfaces/browse';
import { DatabaseService } from '../database.service';
import { TracksLikedDislikedService } from '../Services/tracks-liked-disliked.service';
import { map } from 'rxjs/operators';
import { User } from '../Interfaces/user';



@Component({
  selector: 'app-matchmaker',
  templateUrl: './matchmaker.component.html',
  styleUrls: ['./matchmaker.component.css']
})
export class MatchmakerComponent implements OnInit {
  track: any;
  trackArray: Tracks[] = [];
  currentIndex: number = 0;
  recommended: Recommendations | null = null;
  songIdArray: string[] = [];
  selectedTrack: Tracks[] = [];
  newUser: any;
  newSwipe: any;
  likedTracks: Tracks[] = [];

  constructor(private route: ActivatedRoute,
    private spotifyApi: SpotifyApiService,
    private databaseService: DatabaseService,
    private trackslikeddislikedService: TracksLikedDislikedService) { }

  async ngOnInit(): Promise<void> {





    (await this.spotifyApi.getUserProfile()).subscribe(async (response: any) => {
      let user = (await this.databaseService.getUsers()).pipe(map((response: any) => response.email))

      let newUser = {
        name: response.display_name,
        email: response.email
      }


      if (user !== newUser.email) {

        return this.databaseService.postUser(newUser);
      }

      return user;
    });



    //gets every song id from our database to be used on this page
    (await this.databaseService.getAllSongs()).subscribe(async songs => {


      this.songIdArray = [];
      songs.forEach((song: any) => {
        this.songIdArray.push(song.song_id)
      });

      //uses the ids found in the above to get the info from spotify

      (await this.spotifyApi.getSeveralTracks(this.songIdArray))
        .subscribe((response: any) => {
          this.trackArray = response.tracks
          this.track = response.tracks[0]
          this.currentIndex = 0
          console.log('trackArray', this.trackArray)
        })
    })

  };



  //when yes is clicked, song gets swiped true and pushed to playlist through local storage.
  async likedSwipe() {

    //gets user profile info of currently logged in user and takes just email and puts into backend call for user
    (await this.spotifyApi.getUserProfile()).subscribe(async (response: any) => {

      let userEmail = response.email;


      //backend call for user to get id, grab track string id from local storage 
      (await this.databaseService.getUser(userEmail)).subscribe(async (user: any) => {

        this.trackslikeddislikedService.addedToPlaylist(this.track);


        //calls backend to convert track string id to number so we can store it in swipe
        (await this.databaseService.changeSongStringIdToNumber(this.track.id)).subscribe((song: any) => {

          this.newSwipe = {
            user_id: user.id,
            song_id: song.id,
            swipe: true
          }

          console.log(`newSwipe`, this.newSwipe)


          //moves track ahead in array and posts swipe to our database
          this.currentIndex++;
          this.track = this.trackArray[this.currentIndex]
          this.databaseService.postSwipe(this.newSwipe)
        }
        )
      })
    })


  }
  // dislikedSwipe() {


  // }
};










