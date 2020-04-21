import { Component, ViewChild } from '@angular/core';
import { ProductsService } from '../products/products.service';
import { Router } from '@angular/router';

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

  constructor(private productsService: ProductsService, private router: Router) {
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
    this.productsService.addProductPopup();
  }

  onMyProfileClick() {
    this.router.navigate(['main/user-detail', localStorage.getItem('userId')], { state: { backURL: 'main/dash' } });
  }
}
