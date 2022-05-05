import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-users-create",
  templateUrl: "./users-create.component.html"
})
export class UsersCreateComponent {
  userForm: FormGroup;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      login: ["", Validators.required],
      password: ["", Validators.required],
      cost: ["", [Validators.required, Validators.pattern(/^\d+$/)]],
      isAdmin: [false]
    });
  }

  onSubmit(formData) {
    if (this.userForm.status === "VALID") {
      this.userService.save(formData).subscribe();
      this.router.navigate(["/users"]);
    }
  }
}
