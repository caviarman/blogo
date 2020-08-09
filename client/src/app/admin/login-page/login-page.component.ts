import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { User } from '../../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form: FormGroup;
  message: string;

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.relogin || params.fireAuthErr) {
        this.message = `Вы не авторизованы. Введите логин и пароль`;
      }
    });
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true
    };
    this.auth.login(user).subscribe(res => {
      this.form.reset();
      this.router.navigate(['/admin', 'dashboard']);
    }, () => {
      this.form.reset();
    });
  }

}
