import { Injectable } from '@angular/core';
import { Tracks } from '../Interfaces/tracks';

@Injectable({
  providedIn: 'root'
})
export class TracksLikedDislikedService {

 likedTrack: Tracks[] = [];
 dislikedTrack: Tracks[] = [];
  constructor() { }

  //Adds the yes track to the local storage as an array, Will be pushing the no tracks to the 
  // user data stats to effect avg
  

  addedToPlaylist(song: any) {
    if (this.likedTrack === null) {
      this.likedTrack = []
    }
    this.likedTrack.push(song);
    this.updateLocalStorageLikedTrack(this.likedTrack)
  }

  // Adds the no track to the local storage as an array, Will be pushing the no tracks to the 
  // user data stats to effect avg
  

  dislikedTracks(song:any){
    if(this.dislikedTrack === null){
      this.dislikedTrack = []
    }
    this.dislikedTrack.push(song);
    this.updateLocalStorageDislikedTrack(this.dislikedTrack)
  }

  //Updates the local storage when adding a new yes track 

  updateLocalStorageLikedTrack(selectedJson: any) {

    if (this.likedTrack === null) {
      this.likedTrack = []
    }

    console.log(JSON.stringify(selectedJson))
    localStorage.setItem('likedTrack', JSON.stringify(selectedJson))
  }

  //Updates the local storage when adding a no tack

  updateLocalStorageDislikedTrack(selectedJson: any){
    if(this.dislikedTrack === null){
      this.dislikedTrack = []
    }
    console.log(JSON.stringify(selectedJson))
    localStorage.setItem('dislikedTrack', JSON.stringify(selectedJson))
  }
  

  //Gets the Liked track array from local storage

 returnSelectedTracks() {
    let storageSelected: any = localStorage.getItem('likedTrack');

    if (this.likedTrack === null) {
      this.likedTrack = []
    }

    if (typeof storageSelected === 'object') {
      this.likedTrack = storageSelected

    } else {
      this.likedTrack = JSON.parse(storageSelected);
    }

    return this.likedTrack
  }
}


