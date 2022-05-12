import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  dataSource: User[] = [];
  isLoading: boolean = false;
  isAdmin = false;
  currentUser!: User;
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'login', 'password', 'isAdmin', 'edit', 'delete'];

  constructor(private userService: UserService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.authService.isCurrentUserAdmin().subscribe((result) => (this.isAdmin = result));
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.dataSource = users;
      this.isLoading = false;
    });
  }

  edit(user: User) {
    this.router.navigate([`/users/edit/${user.id}`]);
  }

  play(user: User) {}

  remove(user: User) {
    this.userService.delete(user).subscribe();
    this.getUsers();
  }

  // ngOnInit() {
  //   this.isLoading = true;
  //   this.getUsers();
  // }

  // getUsers(): void {
  //   this.userService.getUsers().subscribe((users) => {
  //     this.users = users;
  //     this.isLoading = false;
  //   });
  // }

  // onEditFirstName(event: any, user: User) {
  //   user.firstName = event.target.value;
  //   this.userService.save(user).subscribe();
  // }

  // onEditLastName(event: any, user: User) {
  //   user.lastName = event.target.value;
  //   this.userService.save(user).subscribe();
  // }

  // onEditLogin(event: any, user: User) {
  //   user.login = event.target.value;
  //   this.userService.save(user).subscribe();
  // }

  // onEditPassword(event: any, user: User) {
  //   user.password = event.target.value;
  //   this.userService.save(user).subscribe();
  // }

  // onEditIsAdmin(user: User) {
  //   console.log(user);
  //   this.userService.save(user).subscribe();
  // }

  // onDelete(user: User) {
  //   this.userService.delete(user).subscribe();
  //   this.getUsers();
  // }
}
