import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CallbackComponent } from './callback/callback.component';
import { SpotifyCallbackComponent } from './spotify-callback/spotify-callback.component';
import { HomeComponent} from './home/home.component'

const routes: Routes = [
  { path: 'spotify-callback', component: SpotifyCallbackComponent },
  { path: '', component: AppComponent },
  { path: 'home', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
