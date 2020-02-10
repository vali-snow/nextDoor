import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../products.service';
import { EnumService } from 'src/app/core/service/enum.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/models/product.model';
import { FormComponent } from '../../common/form/form.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  rows = [];
  buttons = {};
  product: Product;
  editable = false;
  initial: {
    name: string,
    quantity: number,
    description: string
  };

  @ViewChild('filtersForm', { static: false }) filtersForm: FormComponent;
  constructor(private route: ActivatedRoute, private products: ProductsService, private enums: EnumService, private router: Router) {

  }

  ngOnInit() {
    this.product = this.route.snapshot.data['product'];
    this.backupEditableValues(this.product);
    this.generateFormTemplate(this.product);
    this.generateButtons(this.product);
  }

  backupEditableValues(product: Product) {
    this.initial = {
      name: product.Name,
      quantity: product.Quantity,
      description: product.Description
    };
  }

  generateFormTemplate(product: Product) {
    this.rows = [
      {
        name: {
          label: 'Name',
          type: 'text',
          size: '60',
          disabled: true,
          value: product.Name
        },
        seller: {
          label: 'Seller',
          type: 'text',
          size: '40',
          disabled: true,
          value: product.Owner.FirstName + ' ' + product.Owner.LastName
        }
      },
      {
        productType: {
          label: 'Type',
          type: 'text',
          size: '50',
          disabled: true,
          value: this.enums.typeToString('productType', product.Type)
        },
        quantity: {
          label: 'Quantity',
          type: 'number',
          size: '50',
          disabled: true,
          value: product.Quantity,
          minValue: product.Quantity
        }
      },
      {
        description: {
          label: 'Description',
          type: 'textarea',
          size: '100',
          rows: 7,
          disabled: true,
          value: product.Description
        }
      }
    ];
  }

  generateButtons(product: Product) {
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
        remove: {
          order: 3,
          label: 'Remove',
          icon: 'remove_circle',
          disabled: false,
        }
      };
    }
  }

  onClick(buttonKey: string) {
    switch (buttonKey) {
      case 'save':
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
        break;
      case 'remove':
        // logic missing for removing the product, don't cancel the existing orders
        break;
      case 'back':
        this.router.navigate(['main/products-all']);
        break;
      default:
        break;
    }
  }

  getInOrder(a, b) {
    return a.order > b.order ? a : b;
  }
}
