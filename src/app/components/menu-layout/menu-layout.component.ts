import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu-layout',
  templateUrl: './menu-layout.component.html',
  styleUrls: ['./menu-layout.component.css'],
})
export class MenuLayoutComponent implements OnInit {
  isAdmin = false;
  currentUser!: User;
  title = 'Dashboard';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.authService.isCurrentUserAdmin().subscribe((result) => (this.isAdmin = result));
    switch (this.router.url) {
      case '/':
        this.title = 'Tableau de bord';
        break;
      case '/users':
        this.title = 'Utilisateurs';
        break;
      case '/quizz':
        this.title = 'Quizz';
        break;
      default:
        this.title = 'Tableau de bord';
        break;
    }
    console.log(this.router.url);
  }

  logout() {
    this.authService.logout();
  }

  updateTitle(title: string): void {
    this.title = title;
  }
}
