import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MatchmakerComponent } from './matchmaker/matchmaker.component';
import { SpotifyCallbackComponent } from './spotify-callback/spotify-callback.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  { path: 'spotify-callback', component: SpotifyCallbackComponent },
  { path: 'matchmaker', component: MatchmakerComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'home', component: HomeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
