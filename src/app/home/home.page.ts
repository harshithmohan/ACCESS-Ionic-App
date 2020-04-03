import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LockService } from '../services/lock.service';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FingerPrintAuth } from 'capacitor-fingerprint-auth';
import { BackButtonService } from '../services/back-button.service';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  checkedStatus = false;
  loginForm: FormGroup;
  registrationForm: FormGroup;
  showRegistrationForm = false;
  error: string = null;

  constructor(
    private alertController: AlertController,
    private backButton: BackButtonService,
    private formBuilder: FormBuilder,
    private fpAuth: FingerPrintAuth,
    private loadingController: LoadingController,
    private lockService: LockService,
    private menu: MenuService,
    private router: Router,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.backButton.setDefaultBackButton();
    this.checkIfLoggedIn();

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      username: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z0-9]*'), Validators.required])],
      password: ['', Validators.compose([Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})'), Validators.required])],
      confirmPassword: ['', Validators.required],
      email: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+'), Validators.required])],
      phone: ['', Validators.compose([Validators.pattern('[0-9]{10}'), Validators.required])]
    }, {
        validator: this.passwordMatch('password', 'confirmPassword')
    });

  }

  testLogin() {
    this.loginForm.value.username = 'mohan226';
    this.loginForm.value.password = 'Honey@123';
    this.login();
  }

  async checkIfLoggedIn() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    const details: StoredDetails = {
      username: null,
      accessToken: null,
      refreshToken: null,
      fcmToken: null,
      fingerprint: null
    };
    await this.storage.forEach((value, key) => {
      details[key] = value;
    });
    if (details.username !== null) {
      this.menu.fingerprint = details.fingerprint;
      await this.getNewToken(details).then(val => {
        if (details.fingerprint) {
          this.fpAuth.verify().then(result => {
            this.router.navigateByUrl('/tabs');
          }).catch(error => {
            console.log(error);
          });
        } else {
          this.router.navigateByUrl('/tabs');
        }
      });
    }
    loading.dismiss();
  }

  async checkLoginDetails() {
    const loading = await this.loadingController.create({
      message: 'Logging in...'
    });
    loading.present();
    await this.login();
    loading.dismiss();
  }

  async checkRegistrationDetails() {
    const loading = await this.loadingController.create({
      message: 'Registering...'
    });
    loading.present();
    await this.register();
    loading.dismiss();
  }

  async getNewToken(details: StoredDetails): Promise<boolean> {
    await this.lockService.getNewToken(details.refreshToken).then((rdata: any) => {
      if (rdata.status) {
        this.storage.set('username', details.username);
        this.storage.set('accessToken', rdata.content.AccessToken);
        this.storage.set('refreshToken', details.refreshToken);
        details.accessToken = rdata.content.AccessToken;
        console.log(details);
        this.lockService.setUserDetails(details);
        return true;
      } else {
        return false;
      }
    });
    return false;
  }

  async login() {
    const details = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
      appId: 'testApp'
    };
    await this.storage.get('fcmToken').then(token => {
      details.appId = token;
    });
    await this.lockService.login(details).then((rdata: any) => {
      if (rdata.status) {
        this.storage.set('username', details.username);
        this.storage.set('accessToken', rdata.content.AccessToken);
        this.storage.set('refreshToken', rdata.content.RefreshToken);
        const userDetails: StoredDetails = {
          username: details.username,
          accessToken: rdata.content.AccessToken,
          refreshToken: rdata.content.RefreshToken,
          fcmToken: details.appId,
          fingerprint: false
        };
        this.lockService.setUserDetails(userDetails);
        this.loginForm.reset();
        this.registrationForm.reset();
        this.router.navigateByUrl('/tabs');
      } else {
        this.error = rdata.content;
      }
    });
  }

  passwordMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  async register() {
    const details = {
      username: this.registrationForm.value.username,
      password: this.registrationForm.value.password,
      email: this.registrationForm.value.email,
      phone: this.registrationForm.value.phone,
      name: this.registrationForm.value.name
    };
    await this.lockService.register(details).then((rdata: any) => {
      console.log(rdata);
      if (rdata.status) {
        this.registrationForm.reset();
        this.loginForm.reset();
        this.showRegisteredAlert();
        this.toggleRegistrationForm();
      } else {
        this.error = rdata.content;
      }
    });
  }

  async showRegisteredAlert() {
    this.backButton.setAlertBackButton();
    const alert = await this.alertController.create({
      header: 'Account Registered!',
      message: 'Please confirm your email address and login',
      buttons: ['OK']
    });
    alert.onDidDismiss().then(() => this.backButton.setDefaultBackButton());
    await alert.present();
  }

  toggleRegistrationForm() {
    this.error = null;
    this.showRegistrationForm = !this.showRegistrationForm;
  }
}

interface StoredDetails {
  username: string;
  accessToken: string;
  refreshToken: string;
  fcmToken: string;
  fingerprint: boolean;
}
