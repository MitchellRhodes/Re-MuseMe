import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../spotify-api.service';
import { Tracks } from '../Interfaces/tracks';
import { Recommendations } from '../Interfaces/recommendations';
import { DatabaseService } from '../database.service';
import { TracksLikedDislikedService } from '../Services/tracks-liked-disliked.service';
import { map } from 'rxjs/operators';




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
  swipeDirection: string = 'none';

  constructor(private route: ActivatedRoute,
    private spotifyApi: SpotifyApiService,
    private databaseService: DatabaseService,
    private trackslikeddislikedService: TracksLikedDislikedService) { }

  async ngOnInit(): Promise<void> {




    //checks our database for user with email, and if there is no email in ours that matches we create user
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



    //search our database for user after getting email from spotify api so then check the swipes table for songs that have been swiped, 
    //so we can populate with songs that have no swipe
    (await this.spotifyApi.getUserProfile()).subscribe(async (response: any) => {

      let userEmail = response.email;

      (await this.databaseService.getUser(userEmail)).subscribe(async (user: any) => {

        (await this.databaseService.getAllSongsNotSwiped(user.id)).subscribe(async (songs: any) => {


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
            });
        });
      });

    });
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

        


          //moves track ahead in array and posts swipe as true to our database and to users playlist
          this.currentIndex++;
          this.track = this.trackArray[this.currentIndex]
          this.databaseService.postSwipe(this.newSwipe)
          
          this.swipeDirection = 'none';
        }
        )
      })
    });
  }

  //Swipe handler uses custom event provided by hammerjs
  //calculates event data to  know direction of left or right swipe
  //right swipe calls likedSwipe left swipe calls dislikedSwipe

  swipeHandler(event: any){
    let x =
    Math.abs(
       event.deltaX) > 40 ? (event.deltaX > 0 ? "Right" : "Left") : "";
       console.log(x)
      if(x === 'Right'){
        this.swipeDirection = 'right';
        setTimeout(() => {
          this.likedSwipe()
        }, 1000)
      } else {
        this.swipeDirection = 'left';
        setTimeout(() => {
          this.dislikedSwipe()
        }, 1000)
      }
  }


  async dislikedSwipe() {

    //gets user profile info of currently logged in user and takes just email and puts into backend call for user
    (await this.spotifyApi.getUserProfile()).subscribe(async (response: any) => {

      let userEmail = response.email;


      //backend call for user to get id, grab track string id from local storage 
      (await this.databaseService.getUser(userEmail)).subscribe(async (user: any) => {

        this.trackslikeddislikedService.dislikedTracks(this.track);


        //calls backend to convert track string id to number so we can store it in swipe
        (await this.databaseService.changeSongStringIdToNumber(this.track.id)).subscribe((song: any) => {

          this.newSwipe = {
            user_id: user.id,
            song_id: song.id,
            swipe: false
          }


          //moves track ahead in array and posts swipe to our database as false
          this.currentIndex++;
          this.track = this.trackArray[this.currentIndex]
          this.databaseService.postSwipe(this.newSwipe)
          this.swipeDirection = 'none';
        }
        )
      })
    });
  };
};










