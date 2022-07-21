import { Component, OnInit } from '@angular/core';
import { Quizz } from 'src/app/models/quizz.model';
import { QuizzService } from 'src/app/services/quizz.service';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-quizz-list',
  templateUrl: './quizz-list.component.html',
  styleUrls: ['./quizz-list.component.css'],
})
export class QuizzListComponent implements OnInit {
  dataSource = new MatTableDataSource<Quizz>();
  isAdmin = false;
  currentUser!: User;
  displayedColumns: string[] = ['title', 'duration', 'play', 'edit', 'delete'];

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
    this.quizzService.getAllQuizzes().subscribe((quizz) => {
      this.dataSource = new MatTableDataSource(quizz);
    });
  }

  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  edit(quizz: Quizz) {
    this.router.navigate([`/quizz/edit/${quizz.id}`]);
  }

  remove(quizz: Quizz) {
    this.quizzService.delete(quizz).subscribe(() => {
      this.getQuizz();
      this.snackBar.open('Le quizz a bien été supprimé');
    });
  }
}
