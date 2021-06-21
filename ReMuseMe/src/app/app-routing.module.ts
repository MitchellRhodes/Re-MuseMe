import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SpotifyLoginPageComponent } from './spotify-login-page/spotify-login-page.component';
import { SearchPageComponent } from './search-page/search-page.component'
import { SpotifyCallbackComponent } from './spotify-callback/spotify-callback.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [

  { path: 'user-profile', component: UserProfileComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: SpotifyLoginPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'spotify-callback', component: SpotifyCallbackComponent },
  { path: 'about',  component: AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
