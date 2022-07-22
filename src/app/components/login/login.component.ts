import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Credentials } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage!: string;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(formData: Credentials): void {
    if (this.loginForm.status === 'VALID') {
      const loginRequest = this.authService.login(formData);
      loginRequest.subscribe(
        () => {
          this.authService.validateLogin(loginRequest);
        },
        (error) => {
          this.errorMessage = error.message;
        }
      );
    }
  }

  onKeyup(): void {
    this.errorMessage = '';
  }
}
