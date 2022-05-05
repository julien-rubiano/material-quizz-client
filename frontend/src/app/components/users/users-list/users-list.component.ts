import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user.model";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html"
})
export class UsersListComponent implements OnInit {
  users: User[];
  isLoading: boolean;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.isLoading = true;
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.isLoading = false;
    });
  }

  onEditFirstName(event, user: User) {
    user.firstName = event.target.value;
    this.userService.save(user).subscribe();
  }

  onEditLastName(event, user: User) {
    user.lastName = event.target.value;
    this.userService.save(user).subscribe();
  }

  onEditLogin(event, user: User) {
    user.login = event.target.value;
    this.userService.save(user).subscribe();
  }

  onEditPassword(event, user: User) {
    user.password = event.target.value;
    this.userService.save(user).subscribe();
  }

  onEditCost(event, user: User) {
    user.cost = event.target.value;
    this.userService.save(user).subscribe();
  }

  onEditIsAdmin(user: User) {
    this.userService.save(user).subscribe();
  }

  onDelete(user: User) {
    this.userService.delete(user).subscribe();
    this.getUsers();
  }
}
