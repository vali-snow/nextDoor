import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../common/dialog/dialog.component';
import { Product } from 'src/models/product.model';
import { EnumService } from 'src/app/core/service/enum.service';
import { ProductStatus } from 'src/models/enums/product.status.enum';
import { single } from 'rxjs/operators';
import { ProductsService } from '../products/products.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  toggle: {
    enabled: boolean,
    icon: string,
    description: string
  } = {
    enabled: true,
    icon: 'menu_open',
    description: 'Click to collapse navigation bar'
  };

  @ViewChild('sidenav', { static: false }) sidenav: any;

  constructor(public dialog: MatDialog, private toastr: ToastrService, private enums: EnumService, private products: ProductsService) {
  }

  toggleNavbar() {
    this.toggle.enabled = !this.toggle.enabled;
    this.setSidenav();
  }

  private setSidenav() {
    switch (this.toggle.enabled) {
      case false:
        this.toggle.icon = 'menu';
        this.toggle.description = 'Click to expand navigation bar';
        this.sidenav.close();
        break;
      case true:
        this.toggle.icon = 'menu_open';
        this.toggle.description = 'Click to collapse navigation bar';
        this.sidenav.open();
        break;
    }
  }

  onProductAdd() {
    const newProductDialogRef = this.dialog.open(DialogComponent, {
      width: '80%',
      data: {
        title: 'Add New Product',
        dynamic: {
          filters: [
            {
              name: {
                label: 'Name',
                type: 'text',
                size: '100',
                disabled: false,
                validation: {
                  required: true
                }
              }
            },
            {
              productType: {
                label: 'Type',
                type: 'select',
                size: '50',
                disabled: false,
                options: this.enums.getKeysFromEnum('productType'),
                validation: {
                  required: true
                }
              },
              quantity: {
                label: 'Quantity',
                type: 'number',
                size: '50',
                disabled: false,
                validation: {
                  required: true,
                  min: 1
                }
              }
            },
            {
              description: {
                label: 'Description',
                type: 'textarea',
                size: '100',
                rows: 7,
                disabled: false,
                validation: {
                  required: true
                }
              }
            }
          ],
          buttons: {
            add: {
              order: 1,
              label: 'add',
              icon: 'add_circle',
              disabled: true,
            }
          }
        }
      }
    });

    newProductDialogRef.afterOpened().pipe(single()).subscribe(() => {
      const dialogForm = newProductDialogRef.componentInstance.dialogForm.form;
      dialogForm.valueChanges.subscribe(() => {
        const buttons = newProductDialogRef.componentInstance.buttons;
        buttons['add'].disabled = !dialogForm.valid;
      });
    });

    newProductDialogRef.componentInstance.buttonClicked.subscribe(
      (buttonKey: string) => {
        switch (buttonKey) {
          case 'add':
            const values = newProductDialogRef.componentInstance.getFormValues();
            const product = {
              Status: ProductStatus.Listed,
              Name: values['name'],
              Description: values['description'],
              Type: Number(values['productType']),
              Quantity: Number(values['quantity'])
            } as Product;
            this.products.saveProduct(product).subscribe(
              () => {
                newProductDialogRef.close();
                this.toastr.success('Save successful', 'Product added successful');
              },
              (error: any) => {
                this.toastr.error('Save failed', 'Product add failed');
                console.log(error);
              }
            );
            break;
        }
      }
    );
  }
}
