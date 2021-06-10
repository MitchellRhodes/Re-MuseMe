import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../spotify-api.service';
import {CategorySelectedService} from '../Services/category-selected.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  query: string | null = null;
  selectedSearchValue: string | null = null;
  searchResults: any;

  constructor(private route: ActivatedRoute, 
    private spotifyApi: SpotifyApiService, ) { }

    async ngOnInit(): Promise<void> {

      // category page code that will be reworked for finished product - ami

      // console.log(this.selectedCategoryService.returnSelectedCategories())
      
       
      }

      // async onSearchSubmit(form: NgForm){
      //   (await this.spotifyApi.searchBar(form.form.value.query, form.form.value.selectedSearchValue))
      //   .subscribe((response: any) => {
      //     this.searchResults = response;
      //   })
      // }


      
}

