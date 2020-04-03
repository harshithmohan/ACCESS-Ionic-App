import { Component, OnInit } from '@angular/core';
import { BackButtonService } from '../services/back-button.service';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-how-to-use',
  templateUrl: './how-to-use.page.html',
  styleUrls: ['./how-to-use.page.scss'],
})
export class HowToUsePage implements OnInit {

  constructor(
    private backButton: BackButtonService,
    public menu: MenuService
  ) { }

  ngOnInit() {
    this.backButton.setSecondaryBackButton();
  }

}
