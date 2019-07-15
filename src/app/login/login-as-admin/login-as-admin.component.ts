import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login-as-admin',
  templateUrl: './login-as-admin.component.html',
  styleUrls: ['./login-as-admin.component.scss']
})
export class LoginAsAdminComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  async onLoginWithGoogle() {
    await this.authService.signInWithGoogleAsAdmin().then((result) => {
        console.log('User with Gmail account Found');
    }).catch((err) => {
        console.error(err);
    });
}

}
