import { Injectable, SecurityContext } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { single } from 'rxjs/operators';
import { ProductFilters } from 'src/models/filters/product.filters.model';
import { Product } from 'src/models/product.model';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../common/dialog/dialog.component';
import { ToastrService } from 'ngx-toastr';
import { EnumService } from 'src/app/core/service/enum.service';
import { ProductStatus } from 'src/models/enums/product.status.enum';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageDetail } from 'src/models/imagedetail.model';
import { OrdersService } from '../orders/orders.service';
import { OrderDTO } from 'src/models/dto/orderDTO.model';
import { Router } from '@angular/router';
import { Order } from 'src/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient, public dialog: MatDialog, private toastr: ToastrService, private enums: EnumService,
              private ordersService: OrdersService, private sanitizer: DomSanitizer, private router: Router) { }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`https://localhost:44377/api/Products/${id}`).pipe(single());
  }

  getProducts(filters?: ProductFilters): Observable<Product[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.isOwner) {
        params = params.set('isOwner', filters.isOwner.toString());
      }
      if (filters.search && filters.search !== '') {
        params = params.set('search', filters.search);
      }
      if (filters.productType !== null && filters.productType !== undefined) {
        params = params.set('productType', filters.productType.toString());
      }
    }
    return this.http.get<Product[]>('https://localhost:44377/api/Products/', { params: params }).pipe(single());
  }

  saveProduct(product: Product, images: File[] = []) {
    const formData = new FormData();
    formData.append('product', JSON.stringify(product));
    images.forEach((image: File) => {
      formData.append(image.name, image);
    });
    return this.http.post<Product>('https://localhost:44377/api/Products/', formData).pipe(single());
  }

  removeProduct(id: string) {
    return this.http.delete<Product>(`https://localhost:44377/api/Products/${id}`).pipe(single());
  }

  addProductPopup(product?: Product) {
    const newProductDialogRef = this.dialog.open(DialogComponent, {
      width: '80%',
      data: {
        title: 'Add New Product',
        withImage: true,
        dynamic: {
          filters: [
            {
              name: {
                order: 1,
                label: 'Name',
                type: 'text',
                size: '100',
                disabled: false,
                validation: {
                  required: true
                },
                value: product ? product.Name : ''
              }
            },
            {
              productType: {
                order: 1,
                label: 'Type',
                type: 'select',
                size: '40',
                disabled: false,
                options: this.enums.getKeysFromEnum('productType'),
                validation: {
                  required: true
                },
                value: product ? product.Type.toString() : '0'
              },
              quantity: {
                order: 2,
                label: 'Quantity',
                type: 'number',
                size: '30',
                disabled: false,
                validation: {
                  required: true,
                  minValue: 1
                },
                value: product ? product.Quantity : 1
              },
              price: {
                order: 3,
                label: 'Price',
                type: 'number',
                size: '30',
                disabled: false,
                validation: {
                  required: true,
                  minValue: 0
                },
                currency: 'euro',
                value: product ? product.Price : 1
              }
            },
            {
              description: {
                order: 1,
                label: 'Description',
                type: 'textarea',
                size: '100',
                rows: 7,
                disabled: false,
                validation: {
                  required: true
                },
                value: product ? product.Description : ''
              }
            }
          ],
          buttons: {
            add: {
              order: 1,
              label: 'Add',
              icon: 'add_circle',
              disabled: product ? false : true,
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
            const images = newProductDialogRef.componentInstance.getImages();
            const prod = {
              Status: ProductStatus.Listed,
              Name: values['name'],
              Description: values['description'],
              Type: Number(values['productType']),
              Quantity: Number(values['quantity']),
              Price: Number(values['price'])
            } as Product;
            this.saveProduct(prod, images).subscribe(
              (received: Product) => {
                newProductDialogRef.close();
                this.toastr.success('Product added successful', 'Save successful');
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate(['main/product-detail', received.Id], { state: { backURL: 'main/products-all' } });
                });
              },
              (error: any) => {
                this.toastr.error('Product add failed', 'Save failed');
                console.log(error);
              }
            );
            break;
        }
      }
    );
  }

  getSafeLogoURL(prod: Product): string {
    return this.getSafeURLFromImageDetail(prod.Images[0]);
  }

  getSafeURLFromImageDetail(img: ImageDetail): string {
    const unsafeURL = 'data:' + img.Type + ';base64,' + img.Image;
    const safeURL = this.sanitizer.sanitize(SecurityContext.URL, this.sanitizer.bypassSecurityTrustResourceUrl(unsafeURL));
    return safeURL;
  }

  getProductImages(product: Product) {
    return product.Images.map((img: ImageDetail) => this.getSafeURLFromImageDetail(img));
  }

  orderProductPopup(product: Product) {
    const orderProductDialogRef = this.dialog.open(DialogComponent, {
      width: '80%',
      data: {
        title: 'Order Product',
        withImage: true,
        images: this.getProductImages(product),
        product: product,
        dynamic: {
          filters: [
            {
              name: {
                order: 1,
                label: 'Name',
                type: 'text',
                size: '40',
                disabled: true,
                value: product.Name
              },
              productType: {
                order: 2,
                label: 'Type',
                type: 'select',
                size: '20',
                disabled: true,
                options: this.enums.getKeysFromEnum('productType'),
                value: product.Type.toString()
              },
              price: {
                order: 3,
                label: 'Price',
                type: 'number',
                size: '20',
                disabled: true,
                value: product.Price,
                currency: 'euro'
              },
              availableqty: {
                order: 4,
                label: 'Available',
                type: 'number',
                size: '20',
                disabled: true,
                value: product.Quantity
              }
            },
            {
              description: {
                order: 4,
                label: 'Description',
                type: 'textarea',
                size: '100',
                rows: 1,
                disabled: true,
                value: product.Description
              }
            },
            {
              line: {
                order: 5,
                type: 'horizontalLine',
                size: '100'
              }
            },
            {
              contactName: {
                order: 6,
                label: 'Name',
                type: 'text',
                size: '50',
                disabled: false,
                validation: {
                  required: true,
                },
                value: ''
              },
              contactPhone: {
                order: 7,
                label: 'Phone',
                type: 'text',
                size: '30',
                disabled: false,
                validation: {
                  required: true,
                },
                value: ''
              },
              quantity: {
                order: 8,
                label: 'Quantity',
                type: 'number',
                size: '20',
                disabled: false,
                validation: {
                  required: true,
                  min: 0,
                  max: product.Quantity
                },
                value: 1
              }
            },
            {
              contactAddress: {
                label: 'Deliver To Address',
                type: 'textarea',
                size: '100',
                rows: 2,
                disabled: false,
                validation: {
                  required: true,
                },
                value: ''
              }
            }
          ],
          buttons: {
            order: {
              order: 1,
              label: 'Order',
              icon: 'add_circle',
              disabled: true
            }
          }
        }
      }
    });

    orderProductDialogRef.afterOpened().pipe(single()).subscribe(() => {
      const dialogForm = orderProductDialogRef.componentInstance.dialogForm.form;
      dialogForm.valueChanges.subscribe(() => {
        const buttons = orderProductDialogRef.componentInstance.buttons;
        buttons['order'].disabled = !dialogForm.valid;
      });
    });

    orderProductDialogRef.componentInstance.buttonClicked.subscribe(
      (buttonKey: string) => {
        switch (buttonKey) {
          case 'order':
            const values = orderProductDialogRef.componentInstance.getFormValues();
            const orderDTO = {
              ProductId: orderProductDialogRef.componentInstance.data.product.Id,
              Quantity: Number(values['quantity']),
              ContactName: values['contactName'],
              ContactPhone: values['contactPhone'],
              ContactAddress: values['contactAddress']
            } as OrderDTO;
            this.ordersService.saveOrder(orderDTO).subscribe(
              (received: Order) => {
                orderProductDialogRef.close();
                this.toastr.success('Order added successful', 'Save successful');
                this.router.navigate(['main/order-detail', received.Id], { state: { backURL: 'main/orders-to-receive' } });
              },
              (error: any) => {
                this.toastr.error('Order failed', 'Save failed');
                console.log(error);
              }
            );
            break;
        }
      }
    );
  }
}
