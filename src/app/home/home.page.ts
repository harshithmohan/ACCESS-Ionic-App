import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
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
    private fpAuth: FingerPrintAuth
  ) {}

  ngOnInit() {
    App.addListener('backButton', () => App.exitApp());
    this.checkIfLoggedIn();

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z0-9]*'), Validators.required])],
      password: ['', Validators.compose([Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})'), Validators.required])],
      confirmPassword: ['', Validators.required],
      email: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+'), Validators.required])],
      number: ['', Validators.compose([Validators.pattern('[0-9]{10}'), Validators.required])]
    }, {
        validator: this.passwordMatch('password', 'confirmPassword')
    });

  }

  check() {
    this.fpAuth.verify().then(result => {
      this.router.navigateByUrl('/tabs');
    }).catch(error => console.log(error));
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
    await this.storage.get('username').then(username => {
      this.storage.get('accessToken').then(accessToken => {
        this.storage.get('fcmToken').then(appId => {
          this.checkedStatus = true;
          if (username !== null) {
            this.lockService.setUserDetails(username, accessToken, appId);
            this.router.navigateByUrl('/tabs');
          }
        });
      });
    });
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
        this.lockService.setUserDetails(details.username, data.AccessToken, details.appId);
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
      phone: this.registrationForm.value.phone
    };
    await this.lockService.register(details).then((rdata: string) => {
      if (rdata === 'true') {
        this.error = 'Please confirm your email address and login';
        this.toggleRegistrationForm();
      } else {
        this.error = rdata;
      }
    });
  }

  toggleRegistrationForm() {
    this.error = null;
    this.showRegistrationForm = !this.showRegistrationForm;
  }
}
