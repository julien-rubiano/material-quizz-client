import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
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
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  isAdmin: boolean = false;
  currentUser!: User;
  displayedColumns: string[] = ['firstName', 'lastName', 'login', 'password', 'isAdmin', 'edit', 'delete'];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.isCurrentUserAdmin().subscribe((result) => (this.isAdmin = result));
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getAllUsers().subscribe((users) => {
      this.dataSource = new MatTableDataSource(users);
    });
  }

  search(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  edit(user: User): void {
    this.router.navigate([`/users/edit/${user.id}`]);
  }

  remove(user: User): void {
    this.userService.delete(user).subscribe(() => {
      this.snackBar.open("L'utilisateur a bien été supprimé");
      this.getUsers();
    });
  }
}
