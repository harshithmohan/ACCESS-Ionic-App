import { Component, OnInit } from '@angular/core';
import { LockService } from '../services/lock.service';
import { LoadingController, PopoverController, AlertController } from '@ionic/angular';
import { trigger, transition, style, animate, query } from '@angular/animations';
import { AddLockComponent } from '../add-lock/add-lock.component';
import { EditLockComponent } from '../edit-lock/edit-lock.component';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;

@Component({
  selector: 'app-my-locks',
  templateUrl: './my-locks.page.html',
  styleUrls: ['./my-locks.page.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('1000ms ease', style({ height: '292px', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('1000ms ease', style({ height: 0, opacity: 0 }))
      ])
    ]),
    trigger('inOutAnimationInvalid', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('1000ms ease', style({ height: '98px', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('1000ms ease', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})

export class MyLocksPage implements OnInit {

  locks: LockObject;
  lockSet: Set<string>;
  lockSetFav: Set<string>;
  lockSetInvalid: Set<string>;
  expandedLockId = '';

  constructor(
    private lockService: LockService,
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadLocks();
  }

  async addLock() {
    const popover = await this.popoverController.create({
      component: AddLockComponent,
      animated: true,
      showBackdrop: true
    });
    popover.style.cssText = '--width: 80vw;';
    popover.onDidDismiss().then(() => this.loadLocks());
    return await popover.present();
  }

  async deleteLock(lockId: string) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Do you really want to delete this lock?',
      buttons: [
        {
          text: 'Cancel'
        }, {
          text: 'Delete',
          handler: () => {
            this.deleteLockConfirm(lockId);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteLockConfirm(lockId: string) {
    const loading = await this.loadingController.create({
      message: 'Deleting lock...'
    });
    loading.present();
    await this.lockService.deleteLock(lockId).then(() => {
      loading.dismiss();
      this.loadLocks();
    });
  }

  async editLock(lock: Lock) {
    const popover = await this.popoverController.create({
      component: EditLockComponent,
      componentProps: { lock },
      animated: true,
      showBackdrop: true
    });
    popover.style.cssText = '--width: 80vw;';
    popover.onDidDismiss().then(() => this.loadLocks());
    return await popover.present();
  }

  expandLock(lockId: string) {
    if (this.expandedLockId === lockId) {
      this.expandedLockId = '';
    } else {
      this.expandedLockId = lockId;
    }
  }

  async favouriteLock(lockId: string) {
    if (this.locks[lockId].favourite) {
      this.locks[lockId].favourite = false;
      this.lockSetFav.delete(lockId);
      this.lockSet.add(lockId);
      await this.lockService.unfavouriteLock(lockId);
    } else {
      this.locks[lockId].favourite = true;
      this.lockSet.delete(lockId);
      this.lockSetFav.add(lockId);
      await this.lockService.favouriteLock(lockId);
    }
  }

  async getLocks() {
    this.lockSet = new Set();
    this.lockSetFav = new Set();
    this.lockSetInvalid = new Set();
    this.lockService.getLocks().then((rdata: any) => {
      this.locks = rdata.content;
      Object.keys(this.locks).forEach((lockId: string) => {
        if (this.locks[lockId].alias === null || this.locks[lockId].address === null) {
          this.lockSetInvalid.add(lockId);
        } else if (this.locks[lockId].favourite) {
          this.lockSetFav.add(lockId);
        } else {
          this.lockSet.add(lockId);
        }
      });
    });
  }

  async loadLocks() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    await this.getLocks();
    loading.dismiss();
  }

  async lock(lockId: string) {
    const loading = await this.loadingController.create({
      message: 'Locking ' + this.locks[lockId].alias + '...'
    });
    loading.present();
    await this.lockService.lock(lockId);
    loading.dismiss();
  }

  refreshLocks(event) {
    this.getLocks().then(() => {
      event.target.complete();
    });
  }

  async startWebcam(lockId: string) {
    await Browser.open({ url: 'https://mohan226.ddns.net:8080/' });
  }

  async unlock(lockId: string) {
    const loading = await this.loadingController.create({
      message: 'Unlocking ' + this.locks[lockId].alias + '...'
    });
    loading.present();
    await this.lockService.unlock(lockId);
    loading.dismiss();
  }

  viewLogs(lockId: string) {
    this.router.navigate(['/logs'], { queryParams: { filter: true, lockId } });
  }

  viewPermissions(lockId: string) {
    this.router.navigateByUrl('/view-permissions/' + lockId);
  }

}

interface Lock {
  lockId: string;
  alias: string;
  address: string;
  favourite: boolean;
  webcam: boolean;
}

interface LockObject {
  [key: string]: Lock;
}

