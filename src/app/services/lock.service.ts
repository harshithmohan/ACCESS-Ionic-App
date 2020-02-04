import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LockService {

  ec2url = 'http://smartlock-env.xhqi8gwdvk.ap-south-1.elasticbeanstalk.com';

  constructor(
    private http: HttpClient
  ) { }

  async getLocks(username: string) {
    return this.http.post(this.ec2url + '/getLocks', { username }, { responseType: 'text' }).toPromise();
  }

  async checkToken(accessToken: string, refreshToken: string) {
    return this.http.post(this.ec2url + '/checkToken', { accessToken, refreshToken }, { responseType: 'text' }).toPromise();
  }

  async deleteLock(lockId: string) {
    return this.http.post(this.ec2url + '/deleteLock', { lockId }, { responseType: 'text' }).toPromise();
  }

  async getOtherLocks(username: string) {
    return this.http.post(this.ec2url + '/getOtherLocks', { username }, { responseType: 'text' }).toPromise();
  }

  async grantPermission(details: GrantPermissionDetails) {
    console.log(details);
    return this.http.post(this.ec2url + '/grantPermission', details, { responseType: 'text' }).toPromise();
  }

  async favouriteLock(lockId: string) {
    console.log('Fav ' + lockId);
    return this.http.post(this.ec2url + '/toggleFavourite', { lockId, choice: 'fav' }, { responseType: 'text' }).toPromise();
  }

  async lock(lockId: string) {
    // implement
    return Promise.resolve('lock function called');
  }

  async login(details: UserLoginDetails) {
    return this.http.post(this.ec2url + '/login', details, { responseType: 'text' }).toPromise();
  }

  async register(details: UserRegistrationDetails) {
    return this.http.post(this.ec2url + '/signup', details, { responseType: 'text' }).toPromise();
  }

  async unfavouriteLock(lockId: string) {
    console.log('Unfav ' + lockId);
    return this.http.post(this.ec2url + '/toggleFavourite', { lockId, choice: 'unfav' }, { responseType: 'text' }).toPromise();
  }

  async unlock(lockId: string) {
    // implement
    return Promise.resolve('unlock function called');
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
