import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashComponent } from './dash/dash.component';
import { AppMaterialModule } from '../core/app-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsComponent } from './products/products.component';
import { OrdersToFulfillComponent } from './orders/ordersToFulfill.component';
import { OrdersToReceiveComponent } from './orders/ordersToReceive.component';
import { FiltersComponent } from './common/filters/filters.component';
import { DialogComponent } from './common/dialog/dialog.component';
import { FormComponent } from './common/form/form.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { ProductDetailResolver } from './products/product-detail/product-detail.resolver';
import { ProductsService } from './products/products.service';
import { Image9Component } from './common/image9/image9.component';
import { Image9DialogComponent } from './common/image9/dialog/image9-dialog/image9-dialog.component';
import { ProductsResolver } from './products/products.resolver';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dash', component: DashComponent },
      {
        path: 'products-all', component: ProductsComponent,
        resolve: { products: ProductsResolver },
        data: {
          show: 'all',
          title: 'All Products'
        }
      },
      {
        path: 'products-shop', component: ProductsComponent,
        resolve: { products: ProductsResolver },
        data: {
          show: 'mine',
          title: 'My Products'
        }
      },
      { path: 'product-detail/:id', component: ProductDetailComponent, resolve: { product: ProductDetailResolver } },
      { path: 'orders-to-fulfill', component: OrdersToFulfillComponent },
      { path: 'orders-to-receive', component: OrdersToReceiveComponent },
      { path: 'order-detail/:id', component: ProductDetailComponent },
    ]
  }
];

@NgModule({
  declarations: [
    LayoutComponent,
    DashComponent,
    ProductsComponent,
    OrdersToFulfillComponent,
    OrdersToReceiveComponent,
    FiltersComponent,
    DialogComponent,
    FormComponent,
    ProductDetailComponent,
    OrderDetailComponent,
    Image9Component,
    Image9DialogComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    DialogComponent,
    Image9DialogComponent
  ],
  providers: [
    ProductsService,
    ProductsResolver,
    ProductDetailResolver
  ]
})

export class MainModule { }
