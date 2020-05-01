import { Component, OnInit } from '@angular/core';
import { OrdersService } from './orders.service';
import { EnumService } from 'src/app/core/service/enum.service';
import { FilterModel } from 'src/models/filters/filter.model';
import { OrderFilters } from 'src/models/filters/order.filters.model';
import { OrderType } from 'src/models/enums/order.type.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/models/order.model';
import { ImageDetail } from 'src/models/imagedetail.model';
import { ProductsService } from '../products/products.service';
import { ToastrService } from 'ngx-toastr';
import { DialogComponent } from '../common/dialog/dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  ordersType: string = this.route.snapshot.data.show;
  orders: Order[] = [];
  filterModel: FilterModel = {
    title: this.route.snapshot.data.title,
    description: 'Filter Panel',
    array: {
      search: { label: 'Search', type: 'text', size: 40 },
      productType: { label: 'Product Type', type: 'select', size: 20, options: this.enums.getKeysFromEnum('productType') },
      orderStatus: { label: 'Order Status', type: 'select', size: 20, options: this.enums.getKeysFromEnum('orderStatus') },
      dateRange: { label: 'Date Range', type: 'interval', size: 20 }
    }
  };

  constructor(private ordersService: OrdersService, private productsService: ProductsService, public dialog: MatDialog,
              private enums: EnumService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.orders = this.route.snapshot.data.orders;
  }

  onFiltersApply(values: any) {
    const filters: OrderFilters = new OrderFilters();
    switch (this.ordersType) {
      case 'toFulfill':
        filters.orderType = OrderType.ToFulfill;
        break;
      case 'toReceive':
        filters.orderType = OrderType.ToReceive;
        break;
    }
    Object.keys(values).forEach(key => {
      switch (key) {
        case 'search':
          if (values[key] !== '') {
            filters[key] = values[key];
          }
          break;
        case 'productType':
          if (values[key] !== '') {
            filters[key] = this.enums.stringToType('productType', values[key]);
          }
          break;
        case 'orderStatus':
          if (values[key] !== '') {
            filters[key] = this.enums.stringToType('orderStatus', values[key]);
          }
          break;
        case 'dateRange':
          filters[key] = values[key];
          break;
      }
    });
    this.getOrders(filters);
  }

  getOrders(filters: OrderFilters) {
    this.ordersService.getOrders(filters).subscribe(
      (ords: any[]) => {
        this.orders = [...ords];
      },
      (error) => { }
    );
  }

  onProductDetailClick(id: string) {
    switch (this.ordersType) {
      case 'toFulfill':
        this.router.navigate(['main/product-detail', id], { state: { backURL: 'main/orders-to-fulfill' } });
        break;
      case 'toReceive':
        this.router.navigate(['main/product-detail', id], { state: { backURL: 'main/orders-to-receive' } });
        break;
    }
  }

  onUserDetailClick(id: string) {
    switch (this.ordersType) {
      case 'toFulfill':
        this.router.navigate(['main/user-detail', id], { state: { backURL: 'main/orders-to-fulfill' } });
        break;
      case 'toReceive':
        this.router.navigate(['main/user-detail', id], { state: { backURL: 'main/orders-to-receive' } });
        break;
    }
  }

  onOrderDetailClick(id: string) {
    switch (this.ordersType) {
      case 'toFulfill':
        this.router.navigate(['main/order-detail', id], { state: { backURL: 'main/orders-to-fulfill' } });
        break;
      case 'toReceive':
        this.router.navigate(['main/order-detail', id], { state: { backURL: 'main/orders-to-receive' } });
        break;
    }
  }

  onOrderCompletedClick(id: string) {
    let buttons: {};
    let title: string;
    let text: string;
    switch (this.ordersType) {
      case 'toFulfill':
        buttons = {
          complete: {
            order: 1,
            label: 'Delivered',
            icon: 'done',
            disabled: false,
          }
        };
        title = 'Delivered';
        text = 'Did you fullfill the order?';
        break;
      case 'toReceive':
        buttons = {
          complete: {
            order: 1,
            label: 'Received',
            icon: 'done',
            disabled: false,
          }
        };
        title = 'Received';
        text = 'Did you receive the order?';
        break;
    }
    const confirmCompleteDialog = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        title: title,
        text: text,
        withImage: false,
        dynamic: {
          buttons: buttons
        }
      }
    });

    confirmCompleteDialog.componentInstance.buttonClicked.subscribe(
      (buttonKey: string) => {
        switch (buttonKey) {
          case 'complete':
            this.ordersService.completeOrder(id).subscribe(
              () => {
                this.toastr.success('Order complete successfull', 'Order complete successfull');
                const filters: OrderFilters = new OrderFilters();
                switch (this.ordersType) {
                  case 'toFulfill':
                    filters.orderType = OrderType.ToFulfill;
                    break;
                  case 'toReceive':
                    filters.orderType = OrderType.ToReceive;
                    break;
                }
                this.getOrders(filters);
                confirmCompleteDialog.close();
              },
              (error) => {
                this.toastr.success('Order complete failed', 'Order complete failed');
                console.log(error);
              }
            );
            break;
        }
      }
    );
  }

  onOrderCancelledClick(id: string) {
    const cancelDialog = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        title: 'Cancel Order',
        text: 'You are about to cancel the order. Continue?',
        withImage: false,
        dynamic: {
          filters: [
            {
              reason: {
                order: 1,
                label: 'Cancel Reason',
                type: 'textarea',
                size: '100',
                rows: 3,
                disabled: false,
                value: ''
              }
            }
          ],
          buttons: {
            cancel: {
              order: 1,
              label: 'Ok',
              icon: 'cancel',
              disabled: false,
            }
          }
        }
      }
    });

    cancelDialog.componentInstance.buttonClicked.subscribe(
      (buttonKey: string) => {
        switch (buttonKey) {
          case 'cancel':
            const reason = cancelDialog.componentInstance.getFormValue('reason');
            this.ordersService.cancelOrder(id, reason).subscribe(
              () => {
                this.toastr.success('Order cancel successfull', 'Order cancel successfull');
                const filters: OrderFilters = new OrderFilters();
                switch (this.ordersType) {
                  case 'toFulfill':
                    filters.orderType = OrderType.ToFulfill;
                    break;
                  case 'toReceive':
                    filters.orderType = OrderType.ToReceive;
                    break;
                }
                this.getOrders(filters);
                cancelDialog.close();
              },
              (error) => {
                this.toastr.success('Order cancel failed', 'Order cancel failed');
                console.log(error);
              }
            );
            break;
        }
      }
    );
  }

  onGetSafeLogoURL(imageDetail: ImageDetail) {
    return this.productsService.getSafeURLFromImageDetail(imageDetail);
  }
}
