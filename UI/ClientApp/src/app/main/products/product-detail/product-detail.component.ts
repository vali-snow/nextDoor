import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ProductsService } from '../products.service';
import { EnumService } from 'src/app/core/service/enum.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/models/product.model';
import { FormComponent } from '../../common/form/form.component';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from '../../orders/orders.service';
import { DialogComponent } from '../../common/dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { formatDate } from '@angular/common';
import { ProductStatus } from 'src/models/enums/product.status.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  rows = [];
  buttons = {};
  product: Product;
  editable = false;
  initial: {
    name: string,
    quantity: number,
    description: string
  };

  private backURL = 'main/dash';
  private subscriptions: Subscription[] = [];

  @ViewChild('filtersForm', { static: false }) filtersForm: FormComponent;
  constructor(private route: ActivatedRoute, private router: Router, public dialog: MatDialog,
    private productsService: ProductsService, private ordersService: OrdersService,
    private enums: EnumService, private toastr: ToastrService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state && navigation.extras.state.backURL) {
      this.backURL = this.router.getCurrentNavigation().extras.state.backURL;
    }
    this.subscriptions.push(
      this.route.data.subscribe((data: any) => {
        this.product = data.product;
      })
    );
  }

  ngOnInit() {
    this.onInit();
  }

  onInit() {
    this.backupEditableValues(this.product);
    this.generateFormTemplate(this.product);
    this.generateButtons(this.product);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  backupEditableValues(product: Product) {
    this.initial = {
      name: product.Name,
      quantity: product.Quantity,
      description: product.Description
    };
  }

  generateFormTemplate(product: Product) {
    this.rows = [];
    this.rows.push({
      name: {
        order: 1,
        label: 'Name',
        type: 'text',
        size: '60',
        disabled: true,
        value: product.Name
      },
      orderStatus: {
        order: 2,
        label: 'Product Status',
        type: 'select',
        size: '20',
        disabled: true,
        options: this.enums.getKeysFromEnum('productStatus'),
        value: product.Status.toString()
      },
      seller: {
        order: 3,
        label: 'Seller',
        type: 'text',
        size: '20',
        disabled: true,
        value: product.Owner.FirstName + ' ' + product.Owner.LastName
      }
    });
    this.rows.push(
      {
        productType: {
          order: 4,
          label: 'Type',
          type: 'text',
          size: '50',
          disabled: true,
          value: this.enums.typeToString('productType', product.Type)
        },
        quantity: {
          order: 5,
          label: 'Quantity',
          type: 'number',
          size: '20',
          disabled: true,
          value: product.Quantity,
          minValue: product.Quantity
        },
        dateCreated: {
          order: 6,
          label: 'Date Created',
          type: 'text',
          size: '30',
          disabled: true,
          value: formatDate(product.DateCreated, 'mediumDate', 'en-us')
        }
      }
    );
    this.rows.push({
      description: {
        order: 7,
        label: 'Description',
        type: 'textarea',
        size: '100',
        rows: 7,
        disabled: true,
        value: product.Description
      }
    });
  }

  generateButtons(product: Product) {
    if (product.Status === ProductStatus.Listed) {
      const userId = localStorage.getItem('userId');
      if (product.Owner.Id === userId) {
        this.buttons = {
          save: {
            order: 1,
            label: 'Save',
            icon: 'save',
            disabled: true,
          },
          edit: {
            order: 2,
            label: 'Edit',
            icon: 'edit',
            disabled: false,
          },
          copy: {
            order: 3,
            label: 'Copy',
            icon: 'file_copy',
            disabled: false
          },
          remove: {
            order: 4,
            label: 'Remove',
            icon: 'remove_circle',
            disabled: false,
          }
        };
      } else {
        this.buttons = {
          order: {
            order: 1,
            label: 'Order',
            icon: 'save',
            disabled: false,
          }
        };
      }
    }
  }

  onClick(buttonKey: string) {
    switch (buttonKey) {
      case 'save':
        this.updateValuesFromForm();
        this.productsService.saveProduct(this.product).subscribe(
          (prod: Product) => {
            this.product = prod;
            this.backupEditableValues(this.product);
            this.editable = false;
            this.toastr.success('Product save successful', 'Save successful');
          },
          (error: any) => {
            this.toastr.error('Product save failed', 'Save failed');
            console.log(error);
          }
        );
        break;
      case 'edit':
        this.editable = !this.editable;
        this.filtersForm.getFormObj('name').disabled = !this.editable;
        this.filtersForm.getFormObj('quantity').disabled = !this.editable;
        this.filtersForm.getFormObj('description').disabled = !this.editable;
        if (!this.editable) {
          this.filtersForm.form.patchValue({
            name: this.initial.name,
            quantity: this.initial.quantity,
            description: this.initial.description
          });
        }
        this.buttons['copy'].disabled = this.editable;
        this.buttons['save'].disabled = !this.editable;
        break;
      case 'copy':
        this.productsService.addProductPopup(this.product);
        break;
      case 'remove':
        const removeDialog = this.dialog.open(DialogComponent, {
          width: '400px',
          data: {
            title: 'Remove Product',
            text: [
              'You are about to remove the product. Continue?',
              'Orders based on this product will not be removed.*'
            ],
            withImage: false,
            dynamic: {
              buttons: {
                remove: {
                  order: 1,
                  label: 'Ok',
                  icon: 'done',
                  disabled: false,
                }
              }
            }
          }
        });

        removeDialog.componentInstance.buttonClicked.subscribe(
          (btnKey: string) => {
            switch (btnKey) {
              case 'remove':
                this.productsService.removeProduct(this.product.Id).subscribe(
                  () => {
                    this.toastr.success('Product delete successful', 'Delete successful');
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                      this.router.navigate(['main/product-detail', this.product.Id], { state: { backURL: 'main/products-all' } });
                    });
                    removeDialog.close();
                  },
                  (error: any) => {
                    this.toastr.error('Product delete failed', 'Delete failed');
                    console.log(error);
                  }
                );
                break;
            }
          }
        );
        break;
      case 'back':
        this.router.navigate([this.backURL]);
        break;
      case 'order':
        this.productsService.orderProductPopup(this.product);
        break;
      default:
        break;
    }
  }

  updateValuesFromForm() {
    this.product.Name = this.filtersForm.form.get('name').value;
    this.product.Quantity = Number(this.filtersForm.form.get('quantity').value);
    this.product.Description = this.filtersForm.form.get('description').value;
  }

  getInOrder(a, b) {
    return a.order > b.order ? a : b;
  }
}
