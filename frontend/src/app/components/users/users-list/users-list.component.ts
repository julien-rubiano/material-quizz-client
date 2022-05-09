import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  isLoading: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.isLoading = true;
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      this.isLoading = false;
    });
  }

  onEditFirstName(event: any, user: User) {
    user.firstName = event.target.value;
    this.userService.save(user).subscribe();
  }

  onEditLastName(event: any, user: User) {
    user.lastName = event.target.value;
    this.userService.save(user).subscribe();
  }

  onEditLogin(event: any, user: User) {
    user.login = event.target.value;
    this.userService.save(user).subscribe();
  }

  onEditPassword(event: any, user: User) {
    user.password = event.target.value;
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
