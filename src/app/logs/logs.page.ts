import { Component, OnInit } from '@angular/core';
import { LockService } from '../services/lock.service';
import { LoadingController, PopoverController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { LogsFilterComponent } from '../logs-filter/logs-filter.component';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit {

  logs: Array<Log> = [];
  allLogs: Array<Log> = [];
  users: Array<string> = [];
  locks: Array<Lock> = [];
  filter = false;
  filterOptions: FilterOptions = {
    lockId: null,
    startDate: null,
    endDate: null,
    operation: 'both',
    username: null,
    userType: 'both'
  };
  searchQuery = '';

  constructor(
    private lockService: LockService,
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.filter = params.filter;
      this.filterOptions.lockId = params.lockId;
      this.loadLogs();
      this.getLocks();
    });
  }

  async loadFilters() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    await this.applyFilters();
    loading.dismiss();
  }

  async applyFilters() {
    console.log(this.filterOptions);
    this.logs = this.allLogs;
    if (this.filterOptions.lockId !== undefined) {
      const tempLogs: Array<Log> = [];
      this.logs.forEach(log => {
        if (log.lockId === this.filterOptions.lockId) {
          tempLogs.push(log);
        }
      });
      this.logs = tempLogs;
    }
    if (this.filterOptions.operation !== 'both') {
      const tempLogs: Array<Log> = [];
      this.logs.forEach(log => {
        if (log.operation === this.filterOptions.operation) {
          tempLogs.push(log);
        }
      });
      this.logs = tempLogs;
    }
    if (this.filterOptions.userType !== 'both') {
      const tempLogs: Array<Log> = [];
      this.logs.forEach(log => {
        if (log.userType === this.filterOptions.userType) {
          tempLogs.push(log);
        }
      });
      this.logs = tempLogs;
    }
    if (this.filterOptions.startDate !== null) {
      const tempLogs: Array<Log> = [];
      this.logs.forEach(log => {
        if (Date.parse(log.isoTime) >= Date.parse(this.filterOptions.startDate)) {
          tempLogs.push(log);
        }
      });
      this.logs = tempLogs;
    }
    if (this.filterOptions.endDate !== null) {
      const tempLogs: Array<Log> = [];
      this.logs.forEach(log => {
        if (Date.parse(log.isoTime) <= Date.parse(this.filterOptions.endDate)) {
          tempLogs.push(log);
        }
      });
      this.logs = tempLogs;
    }
    if (this.filterOptions.username !== null) {
      const tempLogs: Array<Log> = [];
      this.logs.forEach(log => {
        if (log.username === this.filterOptions.username) {
          tempLogs.push(log);
        }
      });
      this.logs = tempLogs;
    }
  }

  async getLocks() {
    this.lockService.getLocks().then((rdata: string) => {
      const lockObject = JSON.parse(rdata);
      Object.values(lockObject).forEach((lock: Lock) => {
        this.locks.push(lock);
      });
      this.locks.sort(this.lockCompare);
    });
  }

  async getLogs() {
    this.logs = [];
    this.allLogs = [];
    this.lockService.getLogs().then((rdata: string) => {
      const temp = JSON.parse(rdata);
      this.allLogs = temp.logs;
      this.logs = temp.logs;
      this.users = temp.users;
      if (this.filter) {
        this.loadFilters();
      }
    });
  }

  async loadLogs() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    await this.getLogs();
    loading.dismiss();
  }

  lockCompare(a: Lock, b: Lock) {
    const aAlias = a.alias.toUpperCase();
    const bAlias = b.alias.toUpperCase();
    if (aAlias > bAlias) {
      return 1;
    } else if (aAlias < bAlias) {
      return -1;
    } else {
      return 0;
    }
  }

  refreshLogs(event) {
    this.getLogs().then(() => {
      event.target.complete();
    });
  }

  search(event) {
    if (event === '') {
      this.logs = this.allLogs;
    } else {
      this.logs = [];
      this.allLogs.forEach((element: Log) => {
        const exp = new RegExp(event.toLowerCase(), 'g');
        if (exp.test(element.lock.toLowerCase())) {
          this.logs.push(element);
        }
      });
    }
  }

  async showFilters(ev: any) {
    const popover = await this.popoverController.create({
      component: LogsFilterComponent,
      componentProps: { filterOptions: this.filterOptions, users: this.users, locks: this.locks },
      animated: true,
      event: ev,
      showBackdrop: true
    });
    popover.style.cssText = '--width: 94vw;';
    popover.onDidDismiss().then(data => {
      if (data !== null) {
        this.loadFilters();
      }
    });
    return await popover.present();
  }

}

interface Log {
  lockId: string;
  lock: string;
  username: string;
  time: string;
  isoTime: string;
  userType: string;
  operation: string;
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
