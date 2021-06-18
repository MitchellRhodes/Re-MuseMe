import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { threadId } from 'worker_threads';
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
  updateSwipe: any;
  currentIndex: number = 0;
  search: any;


  userId: any;
  songId: any;



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

    this.getUserID();

  }


  // async likedSwipe(track: any) {
  //   // await this.getUserID().then(userid => this.userId = userid)
  //   console.log('userId promise', this.userId)

  //   this.postNewTrack(track);

  //   await this.convertTrackIdToNumber(track);
  //   console.log('songId promise', this.songId);

  //   await this.getSwipe().then(swipe => {

  //   })


  // }


  async likedSwipe(track: any) {

    //gets user profile info of currently logged in user and takes just email and puts into backend call for user
    // (await this.spotifyApi.getUserProfile()).subscribe(async (response: any) => {

    //   let userEmail = response.email;
    //   console.log('email');


    //   // backend call for user to get id, grab track string id from local storage
    //   (await this.databaseService.getUser(userEmail)).subscribe(async (user: any) => {

    this.trackslikeddislikedService.addedToPlaylist(track);
    console.log('track');

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
      console.log('posted');

      //calls backend to convert track string id to number so we can store it in swipe
      this.postNewSwipe(track.id)

    });


  };



  async postNewSwipe(trackId: string) {

    (await this.databaseService.changeSongStringIdToNumber(trackId)).subscribe(async (song: any) => {

      console.log('changed to number', song.id);
      (await this.databaseService.getSingleSwipe(this.userId, song.id)).subscribe((response: any) => {
        console.log(`the response`, response)


        // (await this.databaseService.getSingleSwipe(user.id, song.id)).subscribe((swipe: any) => {
        //   console.log(swipe)

        // if (!response.song_id) {
        this.newSwipe = {
          user_id: this.userId,
          song_id: song.id,
          swipe: true
        }
        // //moves track ahead in array and posts swipe as true to our database and to users playlist
        console.log(`newSwipe`, this.newSwipe)
        this.databaseService.postSwipe(this.newSwipe);


        // } else if (response.song_id) {

        //   this.updateSwipe = {
        //     user_id: this.userId,
        //     song_id: song.id,
        //     swipe: true
        //   }

        //   console.log(`updateSwipe`, this.updateSwipe)
        //   this.databaseService.putSwipe(this.updateSwipe, this.userId, song.id)
        // }
      });
    })
  }



  nextTrack(addToPlaylist: Tracks) {
    // this.trackslikeddislikedService.addToLikedTracks(addToPlaylist);
    this.likedSwipe(addToPlaylist);
    this.alertBox = addToPlaylist;
    setTimeout(() => {
      this.alertBox = null
    }, 3000)

  }



  async getUserID() {
    (await this.spotifyApi.getUserProfile()).subscribe(async (response: any) => {

      let userEmail = response.email;
      console.log('email');


      //backend call for user to get id, grab track string id from local storage 
      (await this.databaseService.getUser(userEmail)).subscribe(async (user: any) => {
        console.log(`userid`, user.id)
        this.userId = user.id
      });
    });
    return this.userId
  }



  async postNewTrack(track: any) {

    this.trackslikeddislikedService.addedToPlaylist(track);
    console.log('track', track);

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

    })
  }


  async convertTrackIdToNumber(track: any) {
    this.trackslikeddislikedService.addedToPlaylist(track);
    //       console.log('track');

    (await this.spotifyApi.getAudioFeaturesForATrack(track.id)).subscribe(async (track: any) => {

      (await this.databaseService.changeSongStringIdToNumber(track.id)).subscribe(async (song: any) => {
        console.log(`songID`, song.id)
        this.songId = song.id
      })

    })
    return this.songId;
  }


  async getSwipe() {
    (await this.databaseService.getSingleSwipe(this.userId, this.songId)).subscribe((swipe: any) => {
      console.log(`swipe`, swipe)
    })
  }


  // async postNewSwipe() {
  //   this.newSwipe = {
  //     user_id: this.userId,
  //     song_id: this.songId,
  //     swipe: true
  //   }
  //   // //moves track ahead in array and posts swipe as true to our database and to users playlist
  //   console.log(`newSwipe`, this.newSwipe)
  //   this.databaseService.postSwipe(this.newSwipe);

  // }


  async putSwipe() {
    this.updateSwipe = {
      user_id: this.userId,
      song_id: this.songId,
      swipe: true
    }

    console.log(`updateSwipe`, this.updateSwipe)
    this.databaseService.putSwipe(this.updateSwipe, this.userId, this.songId)
  }




};
