import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../spotify-api.service';
import { Browse } from '../Interfaces/browse'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  browseCatagories: Browse[] | null = null;

  constructor(private route: ActivatedRoute, private spotifyApi: SpotifyApiService) { }

  async ngOnInit(): Promise<void> {
    (await this.spotifyApi.browseCategories()).subscribe((reponse: any) => {
      this.browseCatagories = reponse.categories.items
      console.log(reponse)
    })
  }

}
