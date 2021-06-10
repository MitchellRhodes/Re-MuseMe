import { Component, OnInit } from '@angular/core';
import { elementAt } from 'rxjs/operators';
import { Browse } from '../Interfaces/browse';
import { CategorySelectedService } from '../Services/category-selected.service';
import { SpotifyApiService } from '../spotify-api.service';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  browseCatagories: Browse[] | null = null;
  selectedCategories: Browse[] = [];

  constructor(private spotifyApi: SpotifyApiService,
    private categorySelectedService: CategorySelectedService) { }

  async ngOnInit(): Promise<void> {

    //This is how to pull every single category/genre from spotifys api

    // category page code that will be reworked for finished product - ami

    // (await this.spotifyApi.browseCategories()).subscribe((response: any) => {
    //   let categories = response.categories.items;
    //   //getting selected categories 
    //   this.selectedCategories = this.categorySelectedService.returnSelectedCategories();
    


    //   //compare response categories against selected categories
    //   if (this.selectedCategories !== null) {
    //     categories.forEach((category: any, index: any) => {
    //       this.selectedCategories.forEach(selected => {
    //         if (category.id === selected.id) {
    //           categories[index].selected = true
    //         }
    //       });
    //     });
    //   }


    //   this.browseCatagories = categories
    //   console.log(this.browseCatagories)
    // });


  }

  //This is how we get the selected class to go onto the genre they click as well as how what they selected
  // gets pushed to the new selectedCategory array which is sent into local storage.
  // still a work in progress - Ami


  // category page code that will be reworked for finished product - ami

  // categorySelect(event: Event, category: Browse) {
  //   let target = event.target as Element;
  //   let isSelected: Boolean = false;
  //   let childTarget: Boolean = false;


  //   if (target.tagName === 'P' || target.tagName === 'IMG') {
  //     if (target.parentElement?.classList.contains('selected')) {
  //       isSelected = true
  //     }
  //   } else {
  //     if (target.classList.contains('selected')) {
  //       isSelected = true
  //     }
  //   }

  //   if (isSelected) {
  //     if (target.tagName === 'P' || target.tagName === 'IMG') {
  //       target.parentElement?.classList.remove('selected')
  //     } else {
  //       target.classList.remove('selected')
  //     }
  //     this.categorySelectedService.removeCategory(category);
  //   } else {
  //     if (target.tagName === 'P' || target.tagName === 'IMG') {
  //       target.parentElement?.classList.add('selected')
  //     } else {
  //       target.classList.add('selected')
  //     }

  //     this.categorySelectedService.addCategory(category);
  //   }
  //   console.log(this.categorySelectedService.returnSelectedCategories())
  // }


  // This is the click event that once the user has selected atleast one genre they are taken to homepage

  // category page code that will be reworked for finished product - ami

  // continueButton() {
  //   if (this.categorySelectedService.returnSelectedCategories().length > 0) {
  //     window.location.href = '/home'
  //   }
  }

