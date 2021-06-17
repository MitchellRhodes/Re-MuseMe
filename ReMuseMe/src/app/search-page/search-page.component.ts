import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../database.service';
import { Artists } from '../Interfaces/artists';
import { Tracks } from '../Interfaces/tracks';
import { TracksLikedDislikedService } from '../Services/tracks-liked-disliked.service';
import { SpotifyApiService } from '../spotify-api.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  query: string | null = null;
  selectedSearchValue: string | null = null;
  searchResults: any;
  trackArray: Tracks[] = [];
  track: any;
  alertBox: Tracks | null = null;
  newSwipe: any;
  currentIndex: number = 0;

  constructor(private route: ActivatedRoute,
    private spotifyApi: SpotifyApiService,
    private trackslikeddislikedService: TracksLikedDislikedService,
    private databaseService: DatabaseService) { }

  async ngOnInit(): Promise<void> {
    let queryString = window.location.search;
    let params = new URLSearchParams(queryString);
    let input = params.get('q');
    let type = params.get('type');



    (await this.spotifyApi.searchBar(input, type)).subscribe((search: any) => {

      //update to response tracks when auth token is working
      this.searchResults = search.tracks.items
    })


  }

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
        }
        )
      })
    });
  }

  //adds the liked track they hit yes on to the local storage as well as when the user hits 
  //add to liked tracks from the search page and the recommended tracks


  nextTrack(addToPlaylist: Tracks) {
    this.likedSwipe();
    // this.trackslikeddislikedService.addedToPlaylist(addToPlaylist);
    this.alertBox = addToPlaylist;
    setTimeout(() => {
      this.alertBox = null
    }, 3000)
  }



}

