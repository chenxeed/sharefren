import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/internal/Observable';


interface GoogleUserInfo {
  name: string,
  granted_scopes: string,
  id: string,
  verified_email: boolean,
  given_name: string,
  locale: string,
  family_name: string,
  email: string,
  picture: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<firebase.User>;
  userDetails: firebase.User = null;

  constructor(private _firebaseAuth: AngularFireAuth) {
    this.user$ = _firebaseAuth.user;
    this.user$.subscribe(async user => {
      if (user) {
        this.userDetails = user;
      }
      else {
        this.userDetails = null;
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        _firebaseAuth.auth.signInAnonymously();
      }
    });
  }

  async loginByGoogle () {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const provider = new firebase.auth.GoogleAuthProvider()
    const link = await this._firebaseAuth.auth.currentUser.linkWithPopup(provider);
    // link the user profile with the google data
    const additionalUserInfo = link.additionalUserInfo.profile as GoogleUserInfo
    await firebase.auth().currentUser.updateProfile({
      photoURL: additionalUserInfo.picture,
      displayName: additionalUserInfo.given_name
    })
    // run this to trigger the user$ with the latest user data
    this._firebaseAuth.auth.updateCurrentUser(this._firebaseAuth.auth.currentUser)
    return link
  }

  logout () {
    return this._firebaseAuth.auth.signOut();
  }
  
}
