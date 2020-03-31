import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { Plugins, PushNotification, PushNotificationToken, PushNotificationActionPerformed, StatusBarStyle } from '@capacitor/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavigationBarPlugin } from 'capacitor-navigationbar';

const { PushNotifications, StatusBar, NavigationBar, SplashScreen } = Plugins;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private storage: Storage,
    private router: Router,
    private alertController: AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      NavigationBar.setBackgroundColor({ color: '#633ce0' });
      StatusBar.setBackgroundColor({ color: '#633ce0' });
      SplashScreen.hide();
      PushNotifications.register();
      PushNotifications.addListener('registration', (token: PushNotificationToken) => {
        console.log(token.value);
        this.storage.get('fcmToken')
        .then((storedToken: string) => {
          if (storedToken !== token.value) {
            this.storage.clear();
            this.storage.set('fcmToken', token.value);
            this.router.navigate(['/home']);
          }
        })
        .catch(() => {
          console.log('Setting token');
          this.storage.set('fcmToken', token.value);
        });
      });
      PushNotifications.addListener('pushNotificationReceived', (notification: PushNotification) => {
        console.log('Push received: ');
        console.log(notification);
        this.showAlert(notification.body);
      }
      );
      PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationActionPerformed) => {
        console.log('Push action performed: ');
        console.log(notification);
      }
      );
    });
  }

  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alert!',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
