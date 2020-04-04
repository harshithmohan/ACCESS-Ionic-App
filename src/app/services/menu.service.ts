import { Injectable } from '@angular/core';
import { LockService } from './lock.service';
import { Router } from '@angular/router';
import { ChangePasswordPage } from '../change-password/change-password.page';
import { ModalController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  fingerprint = false;

  constructor(
    private lockService: LockService,
    private menuController: MenuController,
    private modalController: ModalController,
    private router: Router,
    private storage: Storage
  ) { }

  async changePassword() {
    const modal = await this.modalController.create({
      component: ChangePasswordPage,
      animated: true,
      cssClass: 'auto-height'
    });
    return await modal.present();
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
