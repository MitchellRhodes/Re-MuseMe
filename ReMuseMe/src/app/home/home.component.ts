import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../spotify-api.service';
import { Browse } from '../Interfaces/browse';
import { BrowsecategorydetailsComponent } from '../browsecategorydetails/browsecategorydetails.component';
import { CategorydialogComponent } from '../categorydialog/categorydialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  browseCatagories: Browse[] | null = null;
  categoryDetails: Browse[] | null = null;

  constructor(private route: ActivatedRoute, private spotifyApi: SpotifyApiService) { }

  async ngOnInit(): Promise<void> {
    (await this.spotifyApi.browseCategories()).subscribe((response: any) => {
      this.browseCatagories = response.categories.items
      console.log(response)
    });
  };

}
