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
  search: any;

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

  async likedSwipe(track: any) {

    //gets user profile info of currently logged in user and takes just email and puts into backend call for user
    (await this.spotifyApi.getUserProfile()).subscribe(async (response: any) => {

      let userEmail = response.email;


      //backend call for user to get id, grab track string id from local storage 
      (await this.databaseService.getUser(userEmail)).subscribe(async (user: any) => {

        this.trackslikeddislikedService.addedToPlaylist(track);


        (await this.spotifyApi.getAudioFeaturesForATrack(track.id)).subscribe(async (track: any) => {

          (await this.databaseService.postSongFromSpotify({
            song_id: track.id,
            danceability: track.danceability,
            energy: track.energy,
            speechiness: track.speechiness,
            acousticness: track.acousticness,
            instrumentalness: track.instrumentalness,
            liveness: track.liveness,
            valence: track.valence
          }));

          //calls backend to convert track string id to number so we can store it in swipe
          (await this.databaseService.changeSongStringIdToNumber(track.id)).subscribe((song: any) => {

            this.newSwipe = {
              user_id: user.id,
              song_id: song.id,
              swipe: true
            }

            //moves track ahead in array and posts swipe as true to our database and to users playlist
            this.databaseService.postSwipe(this.newSwipe)
          }
          )
        });

      })
    });
  }


  nextTrack(addToPlaylist: Tracks) {
    // this.trackslikeddislikedService.addToLikedTracks(addToPlaylist);
    this.likedSwipe(addToPlaylist);
    this.alertBox = addToPlaylist;
    setTimeout(() => {
      this.alertBox = null
    }, 3000)

  }



}

