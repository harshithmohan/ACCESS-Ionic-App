import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Plugins, PushNotification, PushNotificationToken, PushNotificationActionPerformed, StatusBarStyle } from '@capacitor/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavigationBarPlugin } from 'capacitor-navigationbar';

const { PushNotifications, StatusBar, NavigationBar } = Plugins;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private storage: Storage,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      NavigationBar.setBackgroundColor({ color: '#000087' });
      StatusBar.setBackgroundColor({ color: '#000087' });
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
      }
      );
      PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationActionPerformed) => {
        console.log('Push action performed: ');
        console.log(notification);
      }
      );
    });
  }
}
