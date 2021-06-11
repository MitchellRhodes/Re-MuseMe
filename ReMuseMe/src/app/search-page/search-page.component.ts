import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  track: Tracks | null = null;
  alertBox: Tracks | null = null;

  constructor(private route: ActivatedRoute, 
    private spotifyApi: SpotifyApiService,
    private trackslikeddislikedService: TracksLikedDislikedService) { }

  async ngOnInit(): Promise<void> {
    let queryString = window.location.search;
    let params = new URLSearchParams(queryString);
    let input = params.get('q');
    let type = params.get('type');

    console.log(input, type);

    (await this.spotifyApi.searchBar(input, type)).subscribe((search:any) => {
      
      console.log(search);
      //update to response tracks when auth token is working
      this.searchResults = search.tracks.items
    })


  }

  nextTrack(addToPlaylist: Tracks) {
      this.trackslikeddislikedService.addedToPlaylist(addToPlaylist);
      this.alertBox = addToPlaylist;
      setTimeout( () => {
        this.alertBox = null
      }, 3000)
  }
}

