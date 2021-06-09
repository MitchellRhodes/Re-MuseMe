import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../spotify-api.service';


@Component({
  selector: 'app-search-criteria',
  templateUrl: './search-criteria.component.html',
  styleUrls: ['./search-criteria.component.css']
})
export class SearchCriteriaComponent implements OnInit {
  query: string | null = null;
  selectedSearchValue: string | null = null;
  selected = 'artist';

  constructor(private route: ActivatedRoute, private spotifyApi: SpotifyApiService) { }


  ngOnInit(): void {
  }

  // This is the search in the navbars call to get the matching items back of what the user put in the 
  //search - Ami

  async search() {
    (await this.spotifyApi.searchBar(this.query, this.selectedSearchValue)).subscribe(search => {
      
      console.log(search);
    })
  }
  

}
