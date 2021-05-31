import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent} from 'src/app/home/home.component';
import { SearchPageComponent } from 'src/app/search-page/search-page.component';
import { UserProfileComponent } from 'src/app/user-profile/user-profile.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent},
    { path: 'search-page', component: SearchPageComponent},
    { path: 'user-profile', component: UserProfileComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}