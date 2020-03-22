import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user: firebase.User;
  loggedIn: boolean = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.loggedIn = user && !user.isAnonymous
    });
  }

  signInWithGoogle(): void {
    this.authService.loginByGoogle();
  }
  
  signOut(): void {
    this.authService.logout();
  }
}
