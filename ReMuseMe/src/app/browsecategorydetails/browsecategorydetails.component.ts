import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../spotify-api.service';
import { Browse } from '../Interfaces/browse'


@Component({
  selector: 'app-browsecategorydetails',
  templateUrl: './browsecategorydetails.component.html',
  styleUrls: ['./browsecategorydetails.component.css']
})
export class BrowsecategorydetailsComponent implements OnInit {

  categoryDetails: Browse[] | null = null;

  constructor(private route: ActivatedRoute, private spotifyApi: SpotifyApiService) { }

  // async ngOnInit(): Promise<void> {
  //   (await this.spotifyApi.browseCategory('id')).subscribe((reponse: any) => {
  //     this.categoryDetails = reponse.categories.items
  //     console.log(reponse)
  //   });

  ngOnInit(): void {
   
      }
    }


