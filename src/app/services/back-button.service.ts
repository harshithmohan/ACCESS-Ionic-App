import { Injectable } from '@angular/core';
import { MenuController, AlertController, ModalController, PopoverController } from '@ionic/angular';
import { Plugins, PluginListenerHandle } from '@capacitor/core';
import { Router } from '@angular/router';

const { App } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class BackButtonService {

  private backButtonListener: PluginListenerHandle;
  private currentListener: string = null;

  constructor(
    private alertController: AlertController,
    private menuController: MenuController,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private router: Router
  ) {
    this.backButtonListener = App.addListener('backButton', () => null);
  }

  private async presentExitAlert() {
    this.setAlertBackButton();
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
    alert.onDidDismiss().then(() => this.setDefaultBackButton());
    await alert.present();
  }

  async setAlertBackButton() {
    console.log('Adding back button listener for alerts');
    this.backButtonListener.remove();
    this.backButtonListener = App.addListener('backButton', () => this.alertController.dismiss());
  }

  async setDefaultBackButton() {
    console.log('Adding default back button listener');
    this.currentListener = 'default';
    this.menuController.enable(true, 'menu');
    this.backButtonListener.remove();
    this.backButtonListener = App.addListener('backButton', () => {
      this.menuController.isOpen('menu').then(open => {
        if (open) {
          this.menuController.close('menu');
        } else {
          this.presentExitAlert();
        }
      });
    });
  }

  async setModalBackButton() {
    console.log('Adding back button listener for modals');
    this.currentListener = 'modal';
    this.backButtonListener.remove();
    this.backButtonListener = App.addListener('backButton', () => this.modalController.dismiss());
  }

  async setPopoverBackButton() {
    console.log('Adding back button listener for popover');
    this.currentListener = 'popover';
    this.backButtonListener.remove();
    this.backButtonListener = App.addListener('backButton', () => this.popoverController.dismiss({
      reloadData: false
    }));
  }

  async setSecondaryBackButton() {
    console.log('Adding secondary back button listener');
    this.currentListener = 'secondary';
    this.backButtonListener.remove();
    this.backButtonListener = App.addListener('backButton', () => {
      this.menuController.isOpen('menu2').then(open => {
        if (open) {
          this.menuController.close('menu2');
        } else {
          this.router.navigateByUrl('/tabs').then(() => this.setDefaultBackButton());
        }
      });
    });
  }

  async unsetAlertBackButton() {
    if (this.currentListener === 'default') {
      this.setDefaultBackButton();
    } else if (this.currentListener === 'modal') {
      this.setModalBackButton();
    } else if (this.currentListener === 'popover') {
      this.setPopoverBackButton();
    } else if (this.currentListener === 'secondary') {
      this.setSecondaryBackButton();
    }
  }
}
