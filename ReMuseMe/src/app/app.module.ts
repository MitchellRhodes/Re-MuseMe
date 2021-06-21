// Core angular imports

import { NgModule,Injectable  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Routing imports 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Angular materials imports

import { MatFormFieldModule } from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Genrated component inports

import { SpotifyLoginComponent } from './spotify-login/spotify-login.component';
import { CallbackComponent } from './callback/callback.component';
import { SpotifyCallbackComponent } from './spotify-callback/spotify-callback.component';
import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { MatchmakerComponent } from './matchmaker/matchmaker.component';
import { HeaderComponent } from './header/header.component';
import { NavComponent } from './nav/nav.component';
import { SearchCriteriaComponent } from './search-criteria/search-criteria.component';
import { SpotifyLoginPageComponent } from './spotify-login-page/spotify-login-page.component';
import { AboutComponent } from './about/about.component';

import {HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import * as Hammer from 'hammerjs';


@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}




@NgModule({
  declarations: [
    AppComponent,
    SpotifyLoginComponent,
    CallbackComponent,
    SpotifyCallbackComponent,
    HomeComponent,
    UserProfileComponent,
    SearchPageComponent,
    MatchmakerComponent,
    HeaderComponent,
    NavComponent,
    SearchCriteriaComponent,
    SpotifyLoginPageComponent,
    AboutComponent,
 
    
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
    HammerModule,
    


  ],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: MyHammerConfig,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
