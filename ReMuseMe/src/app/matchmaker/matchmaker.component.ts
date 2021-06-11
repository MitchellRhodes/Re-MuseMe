import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../spotify-api.service';
import { Tracks } from '../Interfaces/tracks';
import { Recommendations } from '../Interfaces/recommendations';
import { CategorySelectedService } from '../Services/category-selected.service';
import { Browse } from '../Interfaces/browse';
import { DatabaseService } from '../database.service';
import { TracksLikedDislikedService } from '../Services/tracks-liked-disliked.service';



@Component({
  selector: 'app-matchmaker',
  templateUrl: './matchmaker.component.html',
  styleUrls: ['./matchmaker.component.css']
})
export class MatchmakerComponent implements OnInit {
  track: Tracks | null = null;
  trackArray: Tracks[] = [];
  currentIndex: number = 0;
  recommended: Recommendations | null = null;
  songIdArray: string[] = [];
  selectedTrack: Tracks[] = [];

  constructor(private route: ActivatedRoute,
    private spotifyApi: SpotifyApiService,
    private databaseService: DatabaseService,
    private trackslikeddislikedService: TracksLikedDislikedService) { }

  async ngOnInit(): Promise<void> {


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





    //This is currently getting the track by id, I have it hard coded right now just to see exactly how
    //the match maker component would look with everything on it. Will be getting rid of it with the 
    // call below, getRecommendations - Ami


    // (await this.spotifyApi.getATrack()).subscribe((response: any) => {
    //   this.track = response
    //   console.log(response)
    // });


    //This is how the match maker will pull songs based on the seed_genres they select on the category page
    //they will have to atleast choose one in order for the api to pull any recommendations. It's a little
    //messy, I am still working on how to get the seed_genres they pick that got put into a new array to
    //this function. - Ami


    // getRecommended  code that will be reworked for finished product - ami

    //Getting selected categories from service and then creating seed


    // this.selectedCategories = this.categorySelectedService.returnSelectedCategories();
    // let seed = '';
    // this.selectedCategories.forEach((category: any, index: any) => {
    //   if (index > 0){
    //     seed = `${seed},${category.id}`;
    //   } else {
    //     seed = category.id
    //   }
    // });

    // // console.log(seed);

    // //Passing Seed to get recommendations from spotify api service
    // (await this.spotifyApi.getRecommendations(seed)).subscribe((response: any) => {
    //   //console.log(response)
    //   //Not using yet
    //   this.recommended = response


    //   //Selecting a random track from response to play
    //   let trackToPlayIndex = (Math.floor(Math.random() * response.tracks.length) + 1) - 1
    //   this.track = response.tracks[trackToPlayIndex];
    // });



  }

  nextTrack(addToPlaylist: string) {
    if (addToPlaylist === 'true') {

      this.trackslikeddislikedService.addedToPlaylist(this.track)


    } else if (addToPlaylist === 'false') {

      this.trackslikeddislikedService.dislikedTracks(this.track)

    }
    this.currentIndex++;
    this.track = this.trackArray[this.currentIndex]
  }


  // likedSwipe() {
  //   this.databaseService.postSwipe({
  //     user_id = number,
  //     song_id = number,
  //     swipe = true
  //   })
  // }

  dislikedSwipe() {


  }




}
