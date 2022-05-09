import { Component, OnInit } from '@angular/core';
import { Quizz } from 'src/app/models/quizz.model';
import { QuizzService } from 'src/app/services/quizz.service';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quizz-list',
  templateUrl: './quizz-list.component.html',
  styleUrls: ['./quizz-list.component.css'],
})
export class QuizzListComponent implements OnInit {
  dataSource: Quizz[] = [];
  isLoading: boolean = false;
  isAdmin = false;
  currentUser!: User;
  displayedColumns: string[] = ['id', 'name', 'play', 'edit', 'delete'];

  constructor(
    private quizzService: QuizzService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.authService
      .isCurrentUserAdmin()
      .subscribe((result) => (this.isAdmin = result));
    this.getQuizz();
  }

  getQuizz(): void {
    this.quizzService.getQuizz().subscribe((quizz) => {
      this.dataSource = quizz;
      this.isLoading = false;
    });
  }

  onEdit(quizz: Quizz) {
    this.router.navigate([`/quizz/edit/${quizz.id}`]);
  }

  onPlay(quizz: Quizz) {}

  onDelete(quizz: Quizz) {
    this.quizzService.delete(quizz).subscribe();
    this.getQuizz();
  }
}
