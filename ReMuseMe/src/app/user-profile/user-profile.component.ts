import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../spotify-api.service';
import { Profile } from '../Interfaces/profile'
import { TracksLikedDislikedService } from '../Services/tracks-liked-disliked.service';
import { Tracks } from '../Interfaces/tracks';
import { DatabaseService } from '../database.service';
import { Recommendations } from '../Interfaces/recommendations';
import * as CanvasJs from 'canvasjs'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userProfile: Profile | null = null;

  likedTracks: Tracks[] = [];

  track: Tracks | null = null;
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

  statName: any;
  statValue: any;
 

  statArray: number[] = [];




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
    console.log(this.likedTracks);
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
        console.log('trackArray', this.trackArray)

      })

  }

  //do a for loop to get the name2 and value2 in one function

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
  //adds the liked track they hit yes on to the local storage as well as when the user hits 
  //add to liked tracks from the search page and the recommended tracks



  nextTrack(addToPlaylist: Tracks) {
    this.trackslikeddislikedService.addToLikedTracks(addToPlaylist);
    this.alertBox = addToPlaylist;
    setTimeout(() => {
      this.alertBox = null
    }, 3000)

  }


  // Removes a track from the users liked tracks when clicking the x button

  removeTrack(removeFromPlaylist: Tracks){
    this.likedTracks = this.trackslikeddislikedService.removeFromLikedTracks(removeFromPlaylist);
    
  //make sure it is called after  putStatValueInArray
  createChart(array: number[]) {
    let chart = new CanvasJs.Chart("chartContainer", {
      animationEnabled: true,
      title: {
        text: "User Stats",
        horizontalAlign: "left"
      },
      data: [{
        type: "doughnut",
        startAngle: 60,
        //innerRadius: 60,
        indexLabelFontSize: 17,
        indexLabel: "{label} - #percent%",
        toolTipContent: "<b>{label}:</b> {y} (#percent%)",
        dataPoints: [
          { y: (array[0] * 100), label: "Danceability" },
          { y: (array[1] * 100), label: "Energy" },
          { y: (array[2] * 100), label: "Acousticness" },
          { y: (array[3] * 100), label: "Instrumentalness" },
          { y: (array[4] * 100), label: "Valence" }
        ]
      }]
    });
    chart.render();

  
  }

}
