import { Injectable } from '@angular/core';
import { Tracks } from '../Interfaces/tracks';

@Injectable({
  providedIn: 'root'
})
export class TracksLikedDislikedService {

 likedTrack: Tracks[] = [];
 dislikedTrack: Tracks[] = [];
  constructor() { }

  //Pull from local storage into service properties
  getFromLocalStorage(){
    let storageSelected: any = localStorage.getItem('likedTrack');
    this.likedTrack = JSON.parse(storageSelected);
    let storageDisliked: any = localStorage.getItem('dislikedTrack');
    this.dislikedTrack = JSON.parse(storageDisliked);
  }

  //Push from service to local storage
  pushToLocalStorage(){
    localStorage.setItem('dislikedTrack', JSON.stringify(this.dislikedTrack))
    localStorage.setItem('likedTrack', JSON.stringify(this.likedTrack))
  }

  //Adds the yes track to the local storage as an array, Will be pushing the no tracks to the 
  // user data stats to effect avg
  addedToPlaylist(song: any) {
    this.getFromLocalStorage()

    if (this.likedTrack === null) {
      this.likedTrack = []
    }

    this.likedTrack.push(song);

    this.pushToLocalStorage()
  }

  // Adds the no track to the local storage as an array, Will be pushing the no tracks to the 
  // user data stats to effect avg
  dislikedTracks(song:any){
    this.getFromLocalStorage()

    if(this.dislikedTrack === null){
      this.dislikedTrack = []
    }
    
    this.dislikedTrack.push(song);

    this.pushToLocalStorage()
  }
  
  //Gets the Liked track array from local storage
 returnSelectedTracks() {
    this.getFromLocalStorage();
    if (this.likedTrack === null) {
      this.likedTrack = []
    }

    return this.likedTrack
  }

  //Gets the Liked track array from local storage
 returnDislikedTracks() {
  this.getFromLocalStorage();
    if (this.dislikedTrack === null) {
      this.dislikedTrack = []
    }
    return this.dislikedTrack
  }
}