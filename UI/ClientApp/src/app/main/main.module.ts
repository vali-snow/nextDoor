import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashComponent } from './dash/dash.component';
import { AppMaterialModule } from '../core/app-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ServicesComponent } from './services/services.component';
import { ProductsComponent } from './products/products.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dash', component: DashComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'services', component: ServicesComponent }
    ]
  }
];

@NgModule({
  declarations: [LayoutComponent, DashComponent, ServicesComponent, ProductsComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(routes)
  ]
})

export class MainModule { }
