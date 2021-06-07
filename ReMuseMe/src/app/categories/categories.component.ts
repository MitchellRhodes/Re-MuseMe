import { Component, OnInit } from '@angular/core';
import { elementAt } from 'rxjs/operators';
import { Browse } from '../Interfaces/browse';
import { SpotifyApiService } from '../spotify-api.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  browseCatagories: Browse[] | null = null;
  selectedCategories: Browse[] = [];

  constructor(private spotifyApi: SpotifyApiService) { }

  async ngOnInit(): Promise<void> {

    //This is how to pull every single category/genre from spotifys api

    (await this.spotifyApi.browseCategories()).subscribe((response: any) => {
      this.browseCatagories = response.categories.items
      // console.log(response)
    });
  }

  //There has to be a better way to do this which is part of the reason I'm a little confused.
  //This is how we get the selected class to go onto the genre they click as well as how what they selected
  // gets pushed to the new selectedCategory array - Ami


  categorySelect(event: Event, category: Browse){
    let target = event.target as Element;
    let isSelected: Boolean = false;
    let childTarget: Boolean = false;
    
    if(target.tagName === 'P' || target.tagName === 'IMG'){
      if(target.parentElement?.classList.contains('selected')){
        isSelected = true
      }
    } else {
      if(target.classList.contains('selected')){
        isSelected = true
      }
    }

    if (isSelected){
      if(target.tagName === 'P' || target.tagName === 'IMG'){
        target.parentElement?.classList.remove('selected')
      } else {
        target.classList.remove('selected')
      }
      this.selectedCategories = this.selectedCategories.filter(cat => {
        return cat.id !== category.id
      });
    } else {
      if(target.tagName === 'P' || target.tagName === 'IMG'){
        target.parentElement?.classList.add('selected')
      } else {
        target.classList.add('selected')
      }

      this.selectedCategories?.push(category)
    }
    console.log(this.selectedCategories)
  }

  //I don't want to keep this, I need to figure out a way to store this in their local storage because
  //right now the selected categories they choose get displayed in the url which looks really messy
  //The user also must choose atleast one genre they like in order to move onto the homepage
  // I think what I have to do is make a service just for what categories they choose, store it in the 
  // service and pull what's stored to use it for the api call to getRecommended.
  // - Ami


  continueButton(){
    if(this.selectedCategories.length > 0){
      let qurey =  '?q='
      this.selectedCategories.forEach(category => {
          qurey = qurey+category.id+','
      })
      window.location.href = '/home' + qurey
    }
  }

}
