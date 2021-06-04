import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../spotify-api.service';
import { Browse } from '../Interfaces/browse'
import { Observable } from 'rxjs';


@Component({
  selector: 'app-browsecategorydetails',
  templateUrl: './browsecategorydetails.component.html',
  styleUrls: ['./browsecategorydetails.component.css']
})
export class BrowsecategorydetailsComponent implements OnInit {
  browseCatagory: Browse | null = null;
  details: Observable<any> | null = null;

  constructor(
    private route: ActivatedRoute,
    private spotifyApi: SpotifyApiService
  ){}

  async ngOnInit(): Promise<void> {
    (await this.spotifyApi.browseCategory(this.route.snapshot.paramMap.get('id'))).subscribe((reponse: any) => {
      this.browseCatagory = reponse
      console.log(reponse)
    });
  }
}