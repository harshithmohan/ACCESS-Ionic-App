import { Injectable } from '@angular/core';
import { LockService } from './lock.service';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { PopoverController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  fingerprint = false;

  constructor(
    private lockService: LockService,
    private menuController: MenuController,
    private popoverController: PopoverController,
    private router: Router,
    private storage: Storage
  ) { }

  async changePassword() {
    const popover = await this.popoverController.create({
      component: ChangePasswordComponent,
      animated: true,
      showBackdrop: true
    });
    popover.style.cssText = '--width: 80vw;';
    return await popover.present();
  }

  gotoHome() {
    this.menuController.close();
    this.menuController.enable(true, 'menu');
    this.router.navigateByUrl('/tabs');
  }

  gotoHowToUse() {
    this.menuController.close();
    this.menuController.enable(true, 'menu3');
    this.router.navigateByUrl('/how-to-use');
  }

  gotoLogs() {
    this.menuController.close();
    this.menuController.enable(true, 'menu2');
    this.router.navigateByUrl('/logs');
  }

  logout() {
    this.lockService.logout();
    this.storage.clear();
    this.router.navigateByUrl('/home');
  }

  toggleFingerprint() {
    this.storage.set('fingerprint', this.fingerprint);
  }
}
