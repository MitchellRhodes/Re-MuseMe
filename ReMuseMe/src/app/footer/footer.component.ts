///  <reference types="@types/spotify-web-playback-sdk"/>
import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from '../spotify-api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private spotifyApi: SpotifyApiService) { }

  ngOnInit(): void {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = 'BQBaCYi1BVp6-ZkcpY9YmGveVqfWI6R4i4WEJl-ACYWddXlgDmH4Y8i2wK2OTt0fBKptTIZ4Y3v2YD5DRHTYEtDlS19cXh9uaX0R-fVBmAh7pxO-N5dfWRwZhiqkWoG93jEOYIWmnJHVbe3ELdhFOonKhZlkqjeg45Q';
      const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: (cb:any) => { 
          cb(token); 
        }
      });
    
      // Error handling
      player.addListener('initialization_error', (message:any) => { 
        console.error(message); 
      });

      player.addListener('authentication_error', (message:any) => { 
        console.error(message); 
      });

      player.addListener('account_error', (message:any) => { 
        console.error(message); 
      });

      player.addListener('playback_error', (message:any) => { 
        console.error(message); 
      });
    
      // Playback status updates
      player.addListener('player_state_changed', (state:any) => { 
        console.log(state); 
      });
    
      // Ready
      player.addListener('ready', (device_id:any) => {
        console.log('Ready with Device ID', device_id);
      });
    
      // Not Ready
      player.addListener('not_ready', (device_id:any) => {
        console.log('Device ID has gone offline', device_id);
      });
    
      // Connect to the player!
      player.connect().then((success:boolean) => {
        if (success){

        }
      });
    };

  }

}
