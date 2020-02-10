import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashComponent } from './dash/dash.component';
import { AppMaterialModule } from '../core/app-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsAllComponent } from './products/productsAll.component';
import { ProductsHubComponent } from './products/productsHub.component';
import { OrdersToFulfillComponent } from './orders/ordersToFulfill.component';
import { OrdersToReceiveComponent } from './orders/ordersToReceive.component';
import { FiltersComponent } from './common/filters/filters.component';
import { DialogComponent } from './common/dialog/dialog.component';
import { FormComponent } from './common/form/form.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { ProductDetailResolver } from './products/product-detail/product-detail.resolver';
import { ProductsService } from './products/products.service';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dash', component: DashComponent },
      { path: 'products-all', component: ProductsAllComponent },
      { path: 'products-shop', component: ProductsHubComponent },
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
    ProductsAllComponent,
    ProductsHubComponent,
    OrdersToFulfillComponent,
    OrdersToReceiveComponent,
    FiltersComponent,
    DialogComponent,
    FormComponent,
    ProductDetailComponent,
    OrderDetailComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [DialogComponent],
  providers: [
    ProductsService,
    ProductDetailResolver
  ]
})

export class MainModule { }
