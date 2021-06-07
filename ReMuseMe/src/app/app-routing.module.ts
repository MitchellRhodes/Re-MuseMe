import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MatchmakerComponent } from './matchmaker/matchmaker.component';
import { SpotifyCallbackComponent } from './spotify-callback/spotify-callback.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { BrowsecategorydetailsComponent } from './browsecategorydetails/browsecategorydetails.component';
import { SpotifyLoginPageComponent } from './spotify-login-page/spotify-login-page.component';
import { CategoriesComponent } from './categories/categories.component'

const routes: Routes = [
  { path: 'spotify-callback', component: SpotifyCallbackComponent },
  { path: 'matchmaker/:id', component: MatchmakerComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'home', component: HomeComponent },
  { path: 'categories/:id', component: BrowsecategorydetailsComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: SpotifyLoginPageComponent},
  { path: 'category', component: CategoriesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
