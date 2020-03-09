import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-logs-filter',
  templateUrl: './logs-filter.component.html',
  styleUrls: ['./logs-filter.component.scss'],
})
export class LogsFilterComponent implements OnInit {

  @Input() filterOptions: FilterOptions;
  @Input() users: Array<string>;
  @Input() locks: Array<Lock>;
  currentDate = new Date(new Date().getTime() + 1 * 60000).toISOString();
  lockChecked = true;
  unlockChecked = true;
  ownerChecked = true;
  guestChecked = true;

  constructor(
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    if (this.filterOptions.operation === 'lock') {
      this.unlockChecked = false;
    } else if (this.filterOptions.operation === 'unlock') {
      this.lockChecked = false;
    }
    if (this.filterOptions.userType === 'owner') {
      this.guestChecked = false;
    } else if (this.filterOptions.userType === 'guest') {
      this.ownerChecked = false;
    }
  }

  async applyFilters() {
    this.popoverController.dismiss(this.filterOptions);
  }

  async clearFilters() {
    this.filterOptions.lockId = undefined;
    this.filterOptions.startDate = null;
    this.filterOptions.endDate = null;
    this.filterOptions.username = null;
    this.unlockChecked = true;
    this.lockChecked = true;
    this.ownerChecked = true;
    this.guestChecked = true;
    await this.setOperation();
    await this.setUserType();
    this.popoverController.dismiss(this.filterOptions);
  }

  async setOperation() {
    if (this.unlockChecked && this.lockChecked) {
      this.filterOptions.operation = 'both';
    } else if (this.unlockChecked) {
      this.filterOptions.operation = 'unlock';
    } else if (this.lockChecked) {
      this.filterOptions.operation = 'lock';
    } else {
      this.filterOptions.operation = 'both';
    }
  }

  async setUserType() {
    if (this.ownerChecked && this.guestChecked) {
      this.filterOptions.userType = 'both';
    } else if (this.ownerChecked) {
      this.filterOptions.userType = 'owner';
    } else if (this.guestChecked) {
      this.filterOptions.operation = 'guest';
    } else {
      this.filterOptions.operation = 'both';
    }
  }

}

interface FilterOptions {
  lockId: string;
  startDate: string;
  endDate: string;
  operation: string;
  username: string;
  userType: string;
}

interface Lock {
  lockId: string;
  alias: string;
  address: string;
  favourite: boolean;
  webcam: boolean;
}
