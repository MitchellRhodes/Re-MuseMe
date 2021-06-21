import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../spotify-api.service';
import { Profile } from '../Interfaces/profile'
import { TracksLikedDislikedService } from '../Services/tracks-liked-disliked.service';
import { Tracks } from '../Interfaces/tracks';
import { DatabaseService } from '../database.service';
import * as CanvasJs from 'canvasjs'
import { NONE_TYPE } from '@angular/compiler';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userProfile: Profile | null = null;

  likedTracks: Tracks[] = [];

  track: any; //changed from Tracks | null =null
  trackArray: Tracks[] = [];
  currentIndex: number = 0;
  songIdArray: string[] = [];
  selectedTrack: Tracks[] = [];

  userStats: any;

  seedTracks: any;

  randomStatName1: any;
  randomValue1: any;
  randomStatName2: any;
  randomValue2: any;

  randomizedMinMax1: any;
  randomizedMinMax2: any;

  recommended: any;

  alertBox: Tracks | null = null;
  chart: any;
  stats: [] = [];
  statArray: number[] = [];
  newSwipe: any;





  constructor(private route: ActivatedRoute,
    private spotifyApi: SpotifyApiService,
    private trackslikeddislikedService: TracksLikedDislikedService,
    private databaseService: DatabaseService) { }

  //This is how we are getting any of the users spotify profile information

  async ngOnInit(): Promise<void> {


    this.getTracksFromLocalStorage();

    this.getUserStats();




  };


  async getTracksFromLocalStorage() {
    (await this.spotifyApi.getUserProfile()).subscribe(async (response: any) => {
      this.userProfile = response;
    });

    this.likedTracks = this.trackslikeddislikedService.returnSelectedTracks();
  }


  //get user stats used in oninit and get recommendations
  async getUserStats() {
    (await this.spotifyApi.getUserProfile()).subscribe(async (response: any) => {

      let userEmail = response.email;


      //backend call for user to get id, grab track string id from local storage 
      (await this.databaseService.getUser(userEmail)).subscribe(async (user: any) => {

        return (await this.databaseService.getUserStats(user.id)).subscribe(async (stats: any) => {
          this.userStats = stats
          this.getRecommendations();
        })
      })
    });
  }


  async getRecommendations() {

    this.getTracksFromLocalStorage(); //grab track ids and use in url

    this.seedTracks = this.trackslikeddislikedService.returnSelectedTracks();


    let randomTrack1 = this.seedTracks[this.seedTracks.length * Math.random() | 0];

    let randomTrack2 = this.seedTracks[this.seedTracks.length * Math.random() | 0];


    let randomStat1 = this.randomProperty1(this.userStats);

    let randomStat2 = this.randomProperty2(this.userStats);


    this.randomMinMax1();
    this.randomMinMax2();
    this.putStatValueInArray(this.userStats);



    //this is so we do not get user id or the same random stat
    if (this.randomStatName2 === this.randomStatName1) {
      randomStat2 = this.randomProperty2(this.userStats);
    } else if (this.randomValue1 >= 1) {
      randomStat1 = this.randomProperty1(this.userStats);
    } else if (this.randomValue2 >= 1) {
      randomStat2 = this.randomProperty2(this.userStats);
    }

    this.createChart(this.statArray);

    (await this.spotifyApi.getRecommendations(randomTrack1.id, randomTrack2.id, this.randomValue1, this.randomValue2, this.randomStatName1, this.randomStatName2, this.randomizedMinMax1, this.randomizedMinMax2))
      .subscribe((response: any) => {

        this.trackArray = response.tracks
        this.track = response.tracks[0]
        this.currentIndex = 0

      })

  }

  randomProperty1(object: any) {
    let stats = Object.keys(object);
    let random = Math.floor(Math.random() * (stats.length));
    this.randomStatName1 = stats[random];
    this.randomValue1 = object[stats[random]];

  }

  randomProperty2(object: any) {
    let stats = Object.keys(object);
    let random = Math.floor(Math.random() * (stats.length));
    this.randomStatName2 = stats[random];
    this.randomValue2 = object[stats[random]];

  }

  randomMinMax1() {
    let minMaxArray = ['min', 'max']
    let random = Math.floor(Math.random() * (minMaxArray.length));
    this.randomizedMinMax1 = minMaxArray[random]
  }

  randomMinMax2() {
    let minMaxArray = ['min', 'max']
    let random = Math.floor(Math.random() * (minMaxArray.length));
    this.randomizedMinMax2 = minMaxArray[random]
  }



  putStatValueInArray(object: any) {

    let stats = Object.keys(object);

    for (let i = 0; i <= stats.length; i++) {

      let statValue = object[stats[i]];

      if (statValue < 1) {

        let statNumber = statValue.split(`,`).map((x: any) => +x)
        this.statArray.push(statNumber)
      }

    }

    return this.statArray;
  }

  async likedSwipe() {

    //gets user profile info of currently logged in user and takes just email and puts into backend call for user
    (await this.spotifyApi.getUserProfile()).subscribe(async (response: any) => {

      let userEmail = response.email;


      //backend call for user to get id, grab track string id from local storage 
      (await this.databaseService.getUser(userEmail)).subscribe(async (user: any) => {

        this.trackslikeddislikedService.addedToPlaylist(this.track);
        (await this.spotifyApi.getAudioFeaturesForATrack(this.track.id)).subscribe(async (track: any) => {

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
    this.likedSwipe();
    this.alertBox = addToPlaylist;
    setTimeout(() => {
      this.alertBox = null
    }, 3000)

  }

  removeTrack(removeFromPlaylist: Tracks) {

    this.removeStats(removeFromPlaylist)
    this.likedTracks = this.trackslikeddislikedService.removeFromLikedTracks(removeFromPlaylist);
  }


  //make sure it is called after  putStatValueInArray
  createChart(array: number[]) {
    let chart = new CanvasJs.Chart("chartContainer", {
      animationEnabled: true,
      backgroundColor: "rgba(120, 206, 214, .1)",
      title: {
        text: "User Stats",
        horizontalAlign: "left"
      },
      data: [{
        type: "doughnut",
        startAngle: 60,
        //innerRadius: 60,
        indexLabelFontSize: 17,
        indexLabelFontColor: "black",
        indexLabel: "{name} - #percent%",
        toolTipContent: "<b>{label}:</b> {y} (#percent%)",
        dataPoints: [
          { y: (array[0] * 100), name: "Danceability", label: "High: This belongs in a club. Low: It belongs in a museum.", color: "Yellow" },
          { y: (array[1] * 100), name: "Energy", label: "High: You woke up and shotgunned 6 energy drinks. Low: You haven't slept in 2 days.", color: "Crimson" },
          { y: (array[2] * 100), name: "Acousticness", label: "High: You love the clean dulcet tones. Low: CRANK IT TO 11 BABY!", color: "MediumBlue" },
          { y: (array[3] * 100), name: "Instrumentalness", label: "High: Vocals just ruin a song anyways. Low: Maybe you should've chosen a podcast instead.", color: "LawnGreen" },
          { y: (array[4] * 100), name: "Valence", label: "High: You're pumped up by optimism and the major scale. Low: You want to journey to the darkest recesses of your mind.", color: "Indigo" }
        ]
      }]
    });
    chart.render();
  }


  async removeStats(song: any) {

    //gets user profile info of currently logged in user and takes just email and puts into backend call for user
    (await this.spotifyApi.getUserProfile()).subscribe(async (response: any) => {

      let userEmail = response.email;

      //backend call for user to get id
      (await this.databaseService.getUser(userEmail)).subscribe(async (user: any) => {

        //calls backend to convert track string id to number so we can store it in swipe
        (await this.databaseService.changeSongStringIdToNumber(song.id)).subscribe((song: any) => {

          this.newSwipe = {
            user_id: user.id,
            song_id: song.id,
            swipe: false
          }

          this.databaseService.putSwipe(this.newSwipe, user.id, song.id)
        }
        )
      })
    });
  };


};
