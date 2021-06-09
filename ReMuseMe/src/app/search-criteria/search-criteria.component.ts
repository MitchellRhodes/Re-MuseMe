import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { NgForm } from '@angular/forms';
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
  searchResults: any;

  constructor(private route: ActivatedRoute, private spotifyApi: SpotifyApiService) { }


  ngOnInit(): void {

  }

  // This is the search in the navbars call to get the matching items back of what the user put in the 
  //search - Ami

  async search() {
    if(this.selectedSearchValue === null ){
      this.selectedSearchValue = 'any';
    }

    //pass the query and search selected value to the search page
    window.location.href = `/search?q=${this.query}&type=${this.selectedSearchValue}`;



    // (await this.spotifyApi.searchBar(this.query, this.selectedSearchValue)).subscribe(search => {
      
    //   console.log(search);

    //   this.searchResults = search
    // })
  }

  

}
