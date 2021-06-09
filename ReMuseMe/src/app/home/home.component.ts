import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../spotify-api.service';
import {CategorySelectedService} from '../Services/category-selected.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor(private route: ActivatedRoute, 
    private spotifyApi: SpotifyApiService,
    private selectedCategoryService: CategorySelectedService ) { }

    async ngOnInit(): Promise<void> {

      // category page code that will be reworked for finished product - ami

      // console.log(this.selectedCategoryService.returnSelectedCategories())
        
      }

}
