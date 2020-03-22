import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<firebase.User>;
  userDetails: firebase.User = null;

  constructor(private _firebaseAuth: AngularFireAuth) {
    this.user$ = _firebaseAuth.authState;
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
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
  }

  logout () {
    return this._firebaseAuth.auth.signOut();
  }
  
}
