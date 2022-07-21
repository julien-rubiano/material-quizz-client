import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users-save',
  templateUrl: './users-save.component.html',
  styleUrls: ['./users-save.component.css'],
})
export class UsersSaveComponent {
  userForm!: FormGroup;
  isAdmin = false;
  isEditing = false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    this.authService.isCurrentUserAdmin().subscribe((result) => (this.isAdmin = result));
    this.initForm();
    if (userId) {
      this.isEditing = true;
      this.fillForm(userId);
    }
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      login: ['', Validators.required],
      password: ['', Validators.required],
      isAdmin: [false],
    });
  }

  fillForm(userId: string) {
    this.userService.getUserById(userId).subscribe((userResponse) => {
      this.userForm.patchValue({
        id: userResponse.id,
        firstName: userResponse.firstName,
        lastName: userResponse.lastName,
        login: userResponse.login,
        password: userResponse.password,
        isAdmin: userResponse.isAdmin,
      });
    });
  }

  editFirstName(event: any) {
    if (this.isEditing) {
      this.userForm.patchValue({
        firstName: event.target.value,
      });

      this.saveUser(this.userForm.value);
    }
  }

  editLastName(event: any) {
    if (this.isEditing) {
      this.userForm.patchValue({
        lastName: event.target.value,
      });

      this.saveUser(this.userForm.value);
    }
  }

  editLogin(event: any) {
    if (this.isEditing) {
      this.userForm.patchValue({
        login: event.target.value,
      });

      this.saveUser(this.userForm.value);
    }
  }

  editPassword(event: any) {
    if (this.isEditing) {
      this.userForm.patchValue({
        password: event.target.value,
      });

      this.saveUser(this.userForm.value);
    }
  }

  editIsAdmin(event: MatSlideToggleChange) {
    if (this.isEditing) {
      console.log(event.checked);
      this.userForm.patchValue({
        isAdmin: event.checked,
      });

      this.saveUser(this.userForm.value);
    }
  }

  createUser() {
    if (this.userForm.status === 'VALID') {
      this.saveUser(this.userForm.value);
      this.router.navigate(['/users']);
    }
  }

  saveUser(user: User) {
    this.userService.save(user).subscribe((user) => user.id ?? this.snackBar.open("L'utilisateur a bien été créé"));
  }

  return() {
    this.router.navigate(['/users']);
  }
}
