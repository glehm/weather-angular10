import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchCityComponent } from './pages/search-city/search-city.component';
import { DetailsCityComponent } from './pages/details-city/details-city.component';

const routes: Routes = [
    { path: '', redirectTo: "/search", pathMatch: "full" },
    { path: 'search', component: SearchCityComponent },
    { path: 'details', redirectTo: "/search", pathMatch: "full" },
    { path: 'details/:id', component: DetailsCityComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }