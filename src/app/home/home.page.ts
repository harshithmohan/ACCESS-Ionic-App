import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LockService } from '../services/lock.service';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FingerPrintAuth } from 'capacitor-fingerprint-auth';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

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
    private router: Router,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private lockService: LockService,
    private storage: Storage,
    private fpAuth: FingerPrintAuth,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    App.addListener('backButton', () => App.exitApp());
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
      if (details.fingerprint) {
        this.fpAuth.verify().then(result => {
          this.lockService.setUserDetails(details);
          this.router.navigateByUrl('/tabs');
        }).catch(error => {
          console.log(error);
        });
      } else {
        this.lockService.setUserDetails(details);
        this.router.navigateByUrl('/tabs');
      }
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

  async login() {
    const details = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
      appId: 'testApp'
    };
    await this.storage.get('fcmToken').then(token => {
      details.appId = token;
    });
    await this.lockService.login(details).then((rdata: string) => {
      if (rdata.includes('AccessToken')) {
        const data = JSON.parse(rdata);
        this.storage.set('username', details.username);
        this.storage.set('accessToken', data.AccessToken);
        this.storage.set('refreshToken', data.RefreshToken);
        const userDetails: StoredDetails = {
          username: details.username,
          accessToken: data.accessToken,
          refreshToken: data.RefreshToken,
          fcmToken: details.appId,
          fingerprint: false
        };
        this.lockService.setUserDetails(userDetails);
        this.loginForm.reset();
        this.registrationForm.reset();
        this.router.navigateByUrl('/tabs');
      } else {
        this.error = rdata;
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
    await this.lockService.register(details).then((rdata: string) => {
      if (rdata === 'true') {
        this.registrationForm.reset();
        this.loginForm.reset();
        this.showRegisteredAlert();
        this.toggleRegistrationForm();
      } else {
        this.error = rdata;
      }
    });
  }

  async showRegisteredAlert() {
    const alert = await this.alertController.create({
      header: 'Account Registered!',
      message: 'Please confirm your email address and login',
      buttons: ['OK']
    });

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
