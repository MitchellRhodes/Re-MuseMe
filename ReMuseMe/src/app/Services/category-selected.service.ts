import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategorySelectedService {

  selectedCategories: any[] = [];

  constructor() { }

  // this service is for pushing the selected categories the user chooses on the category page to the
  // local storage as well as removing and updating the selectedCategories Array

  addCategory(category: any){
    this.selectedCategories.push(category);
    this.updateLocalStorage(this.selectedCategories)
  }

  removeCategory(category:any){
    this.selectedCategories = this.selectedCategories.filter(cat => {
      return cat.id !== category.id
    });
    this.updateLocalStorage(this.selectedCategories)
  }

  returnSelectedCategories(){
    let storageSelected: any = localStorage.getItem('selectedCategories');
    if(typeof storageSelected === 'object'){
      this.selectedCategories = storageSelected
    } else {
      this.selectedCategories = JSON.parse(storageSelected);
    }
    
    return this.selectedCategories
  }

  updateLocalStorage(selectedJson: any ){
    console.log(JSON.stringify(selectedJson))
    localStorage.setItem('selectedCategories', JSON.stringify(selectedJson))
  }
}
