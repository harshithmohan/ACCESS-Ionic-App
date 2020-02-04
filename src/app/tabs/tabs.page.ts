import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { MenuController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const { App } = Plugins;

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  backPressed = false;

  constructor(
    private router: Router,
    private menuController: MenuController,
    private toastController: ToastController,
    private storage: Storage
  ) { }

  ngOnInit() {
    App.addListener('backButton', () => {
      this.menuController.isOpen('menu').then(open => {
        if (open) {
          this.menuController.close('menu');
        } else if (this.backPressed) {
          App.exitApp();
        } else {
          this.presentToast();
          this.backPressed = true;
          setTimeout(() => {
            this.backPressed = false;
          }, 5000);
        }
      });
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Press back again to exit the app!',
      duration: 2000
    });
    toast.present();
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
    // implement
    this.storage.clear();
    this.router.navigateByUrl('/home');
  }

}
