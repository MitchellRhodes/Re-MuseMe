import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CallbackComponent } from './callback/callback.component';
import { HomeComponent } from './home/home.component';
import { MatchmakerComponent } from './matchmaker/matchmaker.component';
import { SpotifyCallbackComponent } from './spotify-callback/spotify-callback.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { BrowsecategorydetailsComponent } from './browsecategorydetails/browsecategorydetails.component';

const routes: Routes = [
  { path: 'spotify-callback', component: SpotifyCallbackComponent },
  { path: 'matchmaker', component: MatchmakerComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'home', component: HomeComponent },
  { path: 'categories/:id', component: BrowsecategorydetailsComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
