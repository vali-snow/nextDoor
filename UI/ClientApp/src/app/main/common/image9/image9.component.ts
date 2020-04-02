import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image9',
  templateUrl: './image9.component.html',
  styleUrls: ['./image9.component.css']
})
export class Image9Component implements OnInit {

  @Input() images;
  constructor() { }

  ngOnInit() {
  }

}
