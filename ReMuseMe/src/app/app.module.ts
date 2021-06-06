import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SpotifyLoginComponent } from './spotify-login/spotify-login.component';
import { CallbackComponent } from './callback/callback.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SpotifyCallbackComponent } from './spotify-callback/spotify-callback.component';

import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
// import { MusicMatchComponent } from './music-match/music-match.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { MatchmakerComponent } from './matchmaker/matchmaker.component';
import { HeaderComponent } from './header/header.component';
import { NavComponent } from './nav/nav.component';
import { SearchCriteriaComponent } from './search-criteria/search-criteria.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import { BrowsecategorydetailsComponent } from './browsecategorydetails/browsecategorydetails.component';
import { CategorydialogComponent } from './categorydialog/categorydialog.component';






@NgModule({
  declarations: [
    AppComponent,
    SpotifyLoginComponent,
    CallbackComponent,
    SpotifyCallbackComponent,
    HomeComponent,
    UserProfileComponent,
    // MusicMatchComponent,
    SearchPageComponent,
    MatchmakerComponent,
    HeaderComponent,
    NavComponent,
    SearchCriteriaComponent,
    FooterComponent,
    BrowsecategorydetailsComponent,
    CategorydialogComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule, 
    MatButtonModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
