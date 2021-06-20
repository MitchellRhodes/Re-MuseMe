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
  currentPage: number = 1;
  

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


    this.getMatchmakerArray();

  };



  //search our database for user after getting email from spotify api so then check the swipes table for songs that have been swiped, 
  //so we can populate with songs that have no swipe
  async getMatchmakerArray() {

    (await this.spotifyApi.getUserProfile()).subscribe(async (response: any) => {

      let userEmail = response.email;

      (await this.databaseService.getUser(userEmail)).subscribe(async (user: any) => {

        (await this.databaseService.getAllSongsNotSwiped(user.id)).subscribe(async (songs: any) => {

          
          this.songIdArray = [];
          songs.forEach((song: any) => {
            this.songIdArray.push(song.song_id)
          });

          console.log(this.songIdArray)



          //uses the ids found in the above to get the info from spotify
          let songsToCall = [];
          for(let i = 0; i < 50; i++){
            songsToCall.push(this.songIdArray[i])
          }

          (await this.spotifyApi.getSeveralTracks(songsToCall))
            .subscribe((response: any) => {
              this.trackArray = response.tracks
              this.track = response.tracks[0]
              this.currentIndex = 0
              console.log("TrackArray",this.trackArray)
            });
        });
      });
    });
  };


  async repopulateMatchmakerArray() {
    /*When the original array hits the end, we don't splice out so we need to clear the array and then call that random function
again to have it repopulate*/

    //end with recalling this
    this.getMatchmakerArray();
  }




  //when yes is clicked, song gets swiped true and pushed to playlist through local storage.
  async likedSwipe() {
    //gets user profile info of currently logged in user and takes just email and puts into backend call for user
    (await this.spotifyApi.getUserProfile()).subscribe(async (response: any) => {

      let userEmail = response.email;


      //backend call for user to get id, grab track string id from local storage 
      (await this.databaseService.getUser(userEmail)).subscribe(async (user: any) => {

        this.trackslikeddislikedService.addedToPlaylist(this.track);


        //calls backend to convert track string id to number so we can store it in swipe
        (await this.databaseService.changeSongStringIdToNumber(this.track.id)).subscribe(async (song: any) => {

          this.newSwipe = {
            user_id: user.id,
            song_id: song.id,
            swipe: true
          }
          this.databaseService.postSwipe(this.newSwipe)
          
        
          console.log('index', this.currentIndex, this.trackArray.length)

          //moves track ahead in array and posts swipe as true to our database and to users playlist
          if(this.currentIndex < this.trackArray.length -1){
            this.currentIndex++;
            this.track = this.trackArray[this.currentIndex]
          } else{
            let songsToCall = [];
            let indexLeft = 0;
            let songsLeft = (this.songIdArray.length - (50 * this.currentPage))
            if( songsLeft >= 50){
              indexLeft = 50
            }else if(songsLeft > 0){
              indexLeft = (this.songIdArray.length - (50 * this.currentPage))
            } 
            

            for(let i = 0; i < indexLeft; i++){
              songsToCall.push(this.songIdArray[i + (50 * this.currentPage)])
            }

            console.log('songs to call', songsToCall);

            (await this.spotifyApi.getSeveralTracks(songsToCall))
            .subscribe((response: any) => {
              this.trackArray = response.tracks
              this.track = response.tracks[0]
              this.currentIndex = 0
              this.currentPage++
              console.log("TrackArray",this.trackArray)
            });
          }
          
          
          this.swipeDirection = 'none';
          
        }
        )
      })
    });
  }

  //Swipe handler uses custom event provided by hammerjs
  //calculates event data to  know direction of left or right swipe
  //right swipe calls likedSwipe left swipe calls dislikedSwipe

  swipeHandler(event: any) {
    let x =
      Math.abs(
        event.deltaX) > 40 ? (event.deltaX > 0 ? "Right" : "Left") : "";
    if (x === 'Right') {
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
        (await this.databaseService.changeSongStringIdToNumber(this.track.id)).subscribe(async (song: any) => {

          this.newSwipe = {
            user_id: user.id,
            song_id: song.id,
            swipe: false
          }
          
          this.databaseService.postSwipe(this.newSwipe)

          //moves track ahead in array and posts swipe to our database as false

          console.log('index', this.currentIndex, this.trackArray.length)
          
          if(this.currentIndex < this.trackArray.length -1){
            this.currentIndex++;
            this.track = this.trackArray[this.currentIndex]
          } else{
            let songsToCall = [];
            let indexLeft = 0;
            let songsLeft = (this.songIdArray.length - (50 * this.currentPage))
            if(songsLeft >= 50){
              indexLeft = 50
            }else if (songsLeft > 0){
              indexLeft = (this.songIdArray.length - (50 * this.currentPage))
            } 
            

            for(let i = 0; i < indexLeft; i++){
              songsToCall.push(this.songIdArray[i + (50 * this.currentPage)])
            }

            (await this.spotifyApi.getSeveralTracks(songsToCall))
            .subscribe((response: any) => {
              this.trackArray = response.tracks
              this.track = response.tracks[0]
              this.currentIndex = 0
              this.currentPage++
              console.log("TrackArray",this.trackArray)
            });
          }
          this.swipeDirection = 'none';

        }
        )
      })
    });
  };
};










