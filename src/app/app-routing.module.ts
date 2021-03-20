import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add/add.component';
import { ListingComponent } from './listing/listing.component';

const routes: Routes = [
  { path: 'listing', component: ListingComponent },
  { path: 'add', component: AddComponent },
  { path: '', redirectTo: 'listing', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
