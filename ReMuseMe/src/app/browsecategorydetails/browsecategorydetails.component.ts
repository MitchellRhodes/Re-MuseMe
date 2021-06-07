import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../spotify-api.service';
import { Browse } from '../Interfaces/browse'
import { Observable } from 'rxjs';
import { Artists } from '../Interfaces/artists';


//delete this componenet 

@Component({
  selector: 'app-browsecategorydetails',
  templateUrl: './browsecategorydetails.component.html',
  styleUrls: ['./browsecategorydetails.component.css']
})
export class BrowsecategorydetailsComponent implements OnInit {
  browseCatagory: Browse | null = null;
  details: Observable<any> | null = null;
  artistInfo: Artists[] | null = null;

  constructor(
    private route: ActivatedRoute,
    private spotifyApi: SpotifyApiService
  ){}

  async ngOnInit(): Promise<void> {

    // old category page, replacing everything with the music match component

    (await this.spotifyApi.browseCategory(this.route.snapshot.paramMap.get('id'))).subscribe((response: any) => {
      this.browseCatagory = response
      console.log(response)
    });

    (await this.spotifyApi.searchBar(this.route.snapshot.paramMap.get('id'), 'categoryPage')).subscribe((response: any) => {
      console.log(response)
      this.artistInfo = response.artists.items;
    });
   
  }
}