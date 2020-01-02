import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashComponent } from './dash/dash.component';
import { AppMaterialModule } from '../core/app-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsAllComponent } from './products/productsAll.component';
import { ProductsShopComponent } from './products/productsShop.component';
import { OrdersToFulfillComponent } from './orders/ordersToFulfill.component';
import { OrdersToReceiveComponent } from './orders/ordersToReceive.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dash', component: DashComponent },
      { path: 'products-all', component: ProductsAllComponent },
      { path: 'products-shop', component: ProductsShopComponent },
      { path: 'orders-to-fulfill', component: OrdersToFulfillComponent },
      { path: 'orders-to-receive', component: OrdersToReceiveComponent }
    ]
  }
];

@NgModule({
  declarations: [
    LayoutComponent,
    DashComponent,
    ProductsAllComponent,
    ProductsShopComponent,
    OrdersToFulfillComponent,
    OrdersToReceiveComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})

export class MainModule { }
