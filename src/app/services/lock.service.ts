import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LockService {

  ec2url = 'http://smartlock-env.xhqi8gwdvk.ap-south-1.elasticbeanstalk.com';
  // ec2url = 'http://192.168.1.14:5000';
  username: string = null;
  accessToken: string = null;
  refreshToken: string = null;
  appId: string = null;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  addTokens(data: any) {
    console.log('Add Tokens');
    console.log(this.accessToken);
    console.log(this.refreshToken);
    return {
      content: data,
      accessToken: this.accessToken,
      refreshToken: this.refreshToken
    };
  }

  async getStoredData() {
    await this.storage.get('username').then(val => this.username = val);
    await this.storage.get('accessToken').then(val => this.accessToken = val);
    await this.storage.get('refreshToken').then(val => this.refreshToken = val);
  }

  async setUserDetails(details: StoredDetails) {
    this.username = details.username;
    this.accessToken = details.accessToken;
    this.refreshToken = details.refreshToken;
    this.appId = details.fcmToken;
  }

  // HTTP Functions

  async addLock(lockId: string) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/addLock', this.addTokens({ lockId })).toPromise();
  }

  async changePassword(oldPassword: string, newPassword: string) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/changePassword', { oldPassword, newPassword, accessToken: this.accessToken }).toPromise();
  }

  async deleteLock(lockId: string) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/deleteLock', this.addTokens({ lockId })).toPromise();
  }

  async editLock(lockId: string, alias: string, address: string, webcam: boolean) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/editLock', this.addTokens({ lockId, alias, address, webcam })).toPromise();
  }

  async editPermission(details: PermissionDetails) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/editPermission', this.addTokens(details)).toPromise();
  }

  async favouriteLock(lockId: string) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/toggleFavourite', this.addTokens({ lockId, choice: 'fav' })).toPromise();
  }

  async getBluetoothAddress(lockId: string) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/getBluetoothAddress', this.addTokens({ lockId })).toPromise();
  }

  async getNewToken(refreshToken: string) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/getNewToken', { refreshToken }).toPromise();
  }

  async getLocks() {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/getLocks', this.addTokens('')).toPromise();
  }

  async getLogs() {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/getLogs', this.addTokens('')).toPromise();
  }

  async getOtherLocks() {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/getOtherLocks', this.addTokens('')).toPromise();
  }

  async getPermissions(lockId: string) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/getPermissions', this.addTokens({ lockId })).toPromise();
  }

  async grantPermission(details: PermissionDetails) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/grantPermission', this.addTokens(details)).toPromise();
  }

  async lock(lockId: string) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/lockOperations', this.addTokens({ lockId, operation: 'lock' })).toPromise();
  }

  async lockGuest(lockId: string, btUUID: string) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/lockOperationsGuest', this.addTokens({ lockId, btUUID, operation: 'lock'})).toPromise();
  }

  async login(details: UserLoginDetails) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/login', details).toPromise();
  }

  async logout() {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/logout', { username: this.username, accessToken: this.accessToken, appId: this.appId })
      .toPromise();
  }

  async register(details: UserRegistrationDetails) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/register', details).toPromise();
  }

  async revokePermission(lockId: string, username: string) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/revokePermission', this.addTokens({ lockId, username })).toPromise();
  }

  async unfavouriteLock(lockId: string) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/toggleFavourite', this.addTokens({ lockId, choice: 'unfav' })).toPromise();
  }

  async unlock(lockId: string) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/lockOperations', this.addTokens({ lockId, operation: 'unlock'}))
      .toPromise();
  }

  async unlockGuest(lockId: string, btUUID: string) {
    await this.getStoredData();
    return this.http.post(this.ec2url + '/lockOperationsGuest', this.addTokens({ lockId, btUUID, operation: 'unlock'})).toPromise();
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

interface PermissionDetails {
  lockId: string;
  username: string;
  userType: string;
  expiryActual: string;
  expiryDisplay: string;
}

interface StoredDetails {
  username: string;
  accessToken: string;
  refreshToken: string;
  fcmToken: string;
  fingerprint: boolean;
}
