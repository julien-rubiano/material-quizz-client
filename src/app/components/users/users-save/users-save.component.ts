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
  isAdmin: boolean = false;
  isEditing: boolean = false;

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

  initForm(): void {
    this.userForm = this.formBuilder.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      login: ['', Validators.required],
      password: ['', Validators.required],
      isAdmin: [false],
    });
  }

  fillForm(userId: string): void {
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

  editFirstName(event: FocusEvent): void {
    if (this.isEditing) {
      this.userForm.patchValue({
        firstName: (event.target as HTMLInputElement).value,
      });

      this.saveUser(this.userForm.value);
    }
  }

  editLastName(event: FocusEvent): void {
    if (this.isEditing) {
      this.userForm.patchValue({
        lastName: (event.target as HTMLInputElement).value,
      });

      this.saveUser(this.userForm.value);
    }
  }

  editLogin(event: FocusEvent): void {
    if (this.isEditing) {
      this.userForm.patchValue({
        login: (event.target as HTMLInputElement).value,
      });

      this.saveUser(this.userForm.value);
    }
  }

  editPassword(event: FocusEvent): void {
    if (this.isEditing) {
      this.userForm.patchValue({
        password: (event.target as HTMLInputElement).value,
      });

      this.saveUser(this.userForm.value);
    }
  }

  editIsAdmin(event: MatSlideToggleChange): void {
    if (this.isEditing) {
      this.userForm.patchValue({
        isAdmin: event.checked,
      });

      this.saveUser(this.userForm.value);
    }
  }

  createUser(): void {
    if (this.userForm.status === 'VALID') {
      this.saveUser(this.userForm.value);
      this.router.navigate(['/users']);
    }
  }

  saveUser(user: User): void {
    this.userService.save(user).subscribe((user) => user.id ?? this.snackBar.open("L'utilisateur a bien été créé"));
  }

  return(): void {
    this.router.navigate(['/users']);
  }
}
