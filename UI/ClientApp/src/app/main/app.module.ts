import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { AccessGuard } from '../access.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', data: { requiresLogin: true }, canActivate: [ AccessGuard ] },
  { path: '1', component: HomeComponent, canActivate: [ AccessGuard ] },
  { path: 'login', loadChildren: () => import('../login/login.module').then(m => m.LoginModule) }
  //{ path: '**', component: NotFoundComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(
      routes, {enableTracing: true}
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
