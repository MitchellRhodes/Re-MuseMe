import { Injectable } from '@angular/core';
import { Browse } from '../Interfaces/browse';

@Injectable({
  providedIn: 'root'
})
export class CategorySelectedService {

  selectedCategories: Browse[] = [];

  constructor() { }

  // this service is for pushing the selected categories the user chooses on the category page to the
  // local storage as well as removing and updating the selectedCategories Array

  addCategory(category: any) {
    if (this.selectedCategories === null) {
      this.selectedCategories = []
    }
    this.selectedCategories.push(category);
    this.updateLocalStorage(this.selectedCategories)
  }

  removeCategory(category: any) {
    if (this.selectedCategories === null) {
      this.selectedCategories = []
    }
    this.selectedCategories = this.selectedCategories.filter(cat => {
      return cat.id !== category.id
    });
    this.updateLocalStorage(this.selectedCategories)
  }

  returnSelectedCategories() {
    let storageSelected: any = localStorage.getItem('selectedCategories');

    if (this.selectedCategories === null) {
      this.selectedCategories = []
    }

    if (typeof storageSelected === 'object') {
      this.selectedCategories = storageSelected

    } else {
      this.selectedCategories = JSON.parse(storageSelected);
    }

    console.log(this.selectedCategories)
    return this.selectedCategories
  }

  updateLocalStorage(selectedJson: any) {

    if (this.selectedCategories === null) {
      this.selectedCategories = []
    }

    console.log(JSON.stringify(selectedJson))
    localStorage.setItem('selectedCategories', JSON.stringify(selectedJson))
  }
}
