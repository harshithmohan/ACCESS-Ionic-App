import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LockService {

  ec2url = 'http://smartlock-env.xhqi8gwdvk.ap-south-1.elasticbeanstalk.com';
  username: string = null;
  accessToken: string = null;
  appId: string = null;

  constructor(
    private http: HttpClient
  ) { }

  async addLock(lockId: string) {
    return this.http.post(this.ec2url + '/addLock', { username: this.username, lockId }, { responseType: 'text' }).toPromise();
  }

  async checkToken(accessToken: string, refreshToken: string) {
    return this.http.post(this.ec2url + '/checkToken', { accessToken, refreshToken }, { responseType: 'text' }).toPromise();
  }

  async editLock(lockId: string, alias: string, address: string) {
    return this.http.post(this.ec2url + '/editLock', { lockId, alias, address }, { responseType: 'text' }).toPromise();
  }

  async deleteLock(lockId: string) {
    return this.http.post(this.ec2url + '/deleteLock', { lockId }, { responseType: 'text' }).toPromise();
  }

  async favouriteLock(lockId: string) {
    console.log('Fav ' + lockId);
    return this.http.post(this.ec2url + '/toggleFavourite', { lockId, choice: 'fav' }, { responseType: 'text' }).toPromise();
  }

  async getLocks() {
    return this.http.post(this.ec2url + '/getLocks', { username: this.username }, { responseType: 'text' }).toPromise();
  }

  async getOtherLocks() {
    return this.http.post(this.ec2url + '/getOtherLocks', { username: this.username }, { responseType: 'text' }).toPromise();
  }

  async grantPermission(details: GrantPermissionDetails) {
    console.log(details);
    return this.http.post(this.ec2url + '/grantPermission', details, { responseType: 'text' }).toPromise();
  }

  async lock(lockId: string) {
    return this.http.post(this.ec2url + '/lockOperations', { lockId, operation: 'lock', username: this.username },
      { responseType: 'text' }).toPromise();
  }

  async login(details: UserLoginDetails) {
    return this.http.post(this.ec2url + '/login', details, { responseType: 'text' }).toPromise();
  }

  async logout() {
    return this.http.post(this.ec2url + '/logout', { username: this.username, accessToken: this.accessToken, appId: this.appId },
      { responseType: 'text' }).toPromise();
  }

  async register(details: UserRegistrationDetails) {
    return this.http.post(this.ec2url + '/signup', details, { responseType: 'text' }).toPromise();
  }

  async setUserDetails(username: string, accessToken: string, appId: string) {
    this.username = username;
    this.accessToken = accessToken;
    this.appId = appId;
  }

  async unfavouriteLock(lockId: string) {
    console.log('Unfav ' + lockId);
    return this.http.post(this.ec2url + '/toggleFavourite', { lockId, choice: 'unfav' }, { responseType: 'text' }).toPromise();
  }

  async unlock(lockId: string) {
    return this.http.post(this.ec2url + '/lockOperations', { lockId, operation: 'unlock', username: this.username },
      { responseType: 'text' }).toPromise();
  }
}

interface UserLoginDetails {
  username: string;
  password: string;
  appId: string;
}

interface UserRegistrationDetails {
  username: string;
  password: string;
  email: string;
  phone: string;
}

interface GrantPermissionDetails {
  lockId: string;
  username: string;
  userType: string;
  expiry: string;
}
