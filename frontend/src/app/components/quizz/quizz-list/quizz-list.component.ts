import { Component, OnInit } from '@angular/core';
import { Quizz } from 'src/app/models/quizz.model';
import { QuizzService } from 'src/app/services/quizz.service';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-quizz-list',
  templateUrl: './quizz-list.component.html',
  styleUrls: ['./quizz-list.component.css'],
})
export class QuizzListComponent implements OnInit {
  dataSource: Quizz[] = [];
  isAdmin = false;
  currentUser!: User;
  displayedColumns: string[] = ['id', 'title', 'duration', 'play', 'edit', 'delete'];

  constructor(
    private quizzService: QuizzService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.authService.isCurrentUserAdmin().subscribe((result) => (this.isAdmin = result));
    this.getQuizz();
  }

  getQuizz(): void {
    this.quizzService.getQuizz().subscribe((quizz) => {
      this.dataSource = quizz;
    });
  }

  edit(quizz: Quizz) {
    this.router.navigate([`/quizz/edit/${quizz.id}`]);
  }

  play(quizz: Quizz) {}

  remove(quizz: Quizz) {
    this.quizzService.delete(quizz).subscribe(() => {
      this.getQuizz();
      this.snackBar.open('Le quizz a bien été supprimé');
    });
  }
}
