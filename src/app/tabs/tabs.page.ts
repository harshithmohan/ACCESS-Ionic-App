import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { MenuController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { LockService } from '../services/lock.service';

const { App } = Plugins;

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  fingerprint = false;

  constructor(
    private router: Router,
    private menuController: MenuController,
    private alertController: AlertController,
    private storage: Storage,
    private lockService: LockService
  ) { }

  ngOnInit() {
    App.addListener('backButton', () => {
      this.menuController.isOpen('menu').then(open => {
        if (open) {
          this.menuController.close('menu');
        } else {
          this.presentAlert();
        }
      });
    });
    this.storage.get('fingerprint').then(val => this.fingerprint = val);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Do you want to close the app?',
      buttons: [
        {
          text: 'Cancel'
        }, {
          text: 'Close',
          handler: () => {
            App.exitApp();
          }
        }
      ]
    });
    await alert.present();
  }

  gotoHowToUse() {
    this.router.navigateByUrl('/how-to-use');
  }

  gotoLogs() {
    this.router.navigateByUrl('/logs');
  }

  gotoSettings() {
    this.router.navigateByUrl('/settings');
  }

  logout() {
    this.lockService.logout();
    this.storage.clear();
    this.router.navigateByUrl('/home');
  }

  async toggleFingerprint() {
    await this.storage.set('fingerprint', this.fingerprint);
    await this.storage.get('fingerprint').then(val => console.log(val));
  }

}
