import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormComponent } from './form/form.component';
import { IntroComponent } from './intro/intro.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create-bill', component: FormComponent },
  { path: 'update-bill/:billId', component: FormComponent },
  { path: 'intro', component: IntroComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
