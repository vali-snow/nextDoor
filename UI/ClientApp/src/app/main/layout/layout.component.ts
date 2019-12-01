import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  toggle: {icon: string, description: string}
  sidenavExpanded = true;

  @ViewChild('sidenav', {static: false}) sidenav: any;

  constructor() {
  }

  ngOnInit() {
    this.toggleNavbar();
  }

  toggleNavbar() {
    this.sidenavExpanded = !this.sidenavExpanded;
    switch (this.sidenavExpanded) {
      case false:
        this.toggle = {icon: 'menu', description: 'Click to expand navigation bar'};
        this.sidenav.close();
        break;
      case true:
        this.toggle = {icon: 'menu_open', description: 'Click to collapse navigation bar'};
        this.sidenav.open();
        break;
    }
  }
}
