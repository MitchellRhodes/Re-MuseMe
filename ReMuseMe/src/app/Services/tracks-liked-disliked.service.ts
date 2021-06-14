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
    this.likedTrack = this._removeDuplicates(this.likedTrack);
    
    this.pushToLocalStorage()
  }

  //Removes array duplicates
  _removeDuplicates(arry: any){
    let uniqueTracks: any = [];
    arry.map((track:Tracks) => uniqueTracks.filter((a:any) => a.id == track.id).length > 0 ? null : uniqueTracks.push(track));
    return uniqueTracks;
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

  //Removes liked track from track array in local storage when clicking the x button
  removeFromLikedTracks(song: any) {
    this.getFromLocalStorage()

    if (this.likedTrack === null) {
      this.likedTrack = []
    }

    let index = this.likedTrack.findIndex(track => track.id === song.id);
    this.likedTrack.splice(index, 1)
    this.pushToLocalStorage()

    return this.likedTrack
  }
}