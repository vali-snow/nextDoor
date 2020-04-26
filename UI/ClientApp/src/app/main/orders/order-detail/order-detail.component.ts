import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from 'src/models/order.model';
import { FormComponent } from '../../common/form/form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../products/products.service';
import { OrdersService } from '../orders.service';
import { EnumService } from 'src/app/core/service/enum.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  rows = [];
  buttons = {};
  order: Order;
  editable = false;

  private backURL = 'main/dash';

  @ViewChild('form', { static: false }) form: FormComponent;

  constructor(private route: ActivatedRoute, private router: Router,
    private productsService: ProductsService, private ordersService: OrdersService,
    private enums: EnumService, private toastr: ToastrService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state && navigation.extras.state.backURL) {
      this.backURL = this.router.getCurrentNavigation().extras.state.backURL;
    }
  }

  ngOnInit() {
    this.order = this.route.snapshot.data.order;
    this.generateFormTemplate(this.order);
    this.generateButtons(this.order);
  }

  generateFormTemplate(order: Order) {
    this.rows.push({
      productName: {
        order: 1,
        label: 'Product Name',
        type: 'text',
        size: '40',
        disabled: true,
        value: order.Product.Name
      },
      productType: {
        order: 2,
        label: 'Type',
        type: 'select',
        size: '30',
        disabled: true,
        options: this.enums.getKeysFromEnum('productType'),
        value: order.Product.Type.toString()
      },
      productSeller: {
        order: 3,
        label: 'Seller',
        type: 'text',
        size: '30',
        disabled: true,
        value: order.Product.Owner.FirstName + order.Product.Owner.LastName
      }
    });
    this.rows.push({
      productDescription: {
        order: 4,
        label: 'Description',
        type: 'textarea',
        size: '100',
        rows: 2,
        disabled: true,
        value: order.Product.Description
      }
    });
    this.rows.push({
      orderStatus: {
        order: 1,
        label: 'Order Status',
        type: 'select',
        size: '40',
        disabled: true,
        options: this.enums.getKeysFromEnum('orderStatus'),
        value: order.Status.toString()
      },
      orderedQuantity: {
        order: 2,
        label: 'Quantity',
        type: 'number',
        size: '30',
        disabled: true,
        value: order.Quantity
      },
      datePlaced: {
        order: 3,
        label: 'Date Placed',
        type: 'text',
        size: '30',
        disabled: true,
        value: order.DatePlaced
      },
    });
    if (order.DateCompleted) {
      this.rows.push({
        date: {
          order: 1,
          label: 'Date Completed',
          type: 'text',
          size: '50',
          disabled: true,
          value: order.DateCompleted
        },
        completedBy: {
          order: 2,
          label: 'Completed By',
          type: 'text',
          size: '50',
          disabled: true,
          value: order.CompletedBy
        }
      });
    }
    if (order.DateCancelled) {
      this.rows.push({
        date: {
          order: 1,
          label: 'Date Cancelled',
          type: 'text',
          size: '25',
          disabled: true,
          value: order.DateCompleted
        },
        completedBy: {
          order: 2,
          label: 'Cancelled By',
          type: 'text',
          size: '25',
          disabled: true,
          value: order.CompletedBy
        },
        reasonCancelled: {
          order: 3,
          label: 'Reason Cancelled',
          type: 'text',
          size: '50',
          disabled: true,
          value: order.CompletedBy
        }
      });
    }
    this.rows.push({
      contactName: {
        order: 1,
        label: 'Contact Name',
        type: 'text',
        size: '60',
        disabled: true,
        value: order.AdditionalDetail.ContactName
      },
      contactPhone: {
        order: 2,
        label: 'Phone',
        type: 'text',
        size: '40',
        disabled: true,
        value: order.AdditionalDetail.ContactPhone
      }
    });
    this.rows.push({
      contactAddress: {
        order: 1,
        label: 'Address',
        type: 'textarea',
        size: '100',
        rows: 3,
        disabled: true,
        value: order.AdditionalDetail.ContactAddress
      }
    });
  }

  generateButtons(order: Order) {
    const userId = localStorage.getItem('userId');
    if (order.Seller.Id === userId || order.Buyer.Id === userId) {
      this.buttons = {
        complete: {
          order: 1,
          label: 'Complete',
          icon: 'remove_circle',
          disabled: false,
        },
        cancel: {
          order: 2,
          label: 'Cancel',
          icon: 'remove_circle',
          disabled: false,
        }
      };
    }
  }

  onClick(buttonKey: string) {
    switch (buttonKey) {
      case 'complete':
        break;
      case 'cancel':
        break;
      case 'back':
        this.router.navigate([this.backURL]);
        break;
      default:
        break;
    }
  }

  getInOrder(a, b) {
    return a.order > b.order ? a : b;
  }
}
