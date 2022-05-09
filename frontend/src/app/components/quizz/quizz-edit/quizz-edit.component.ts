import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Quizz } from 'src/app/models/quizz.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { QuizzService } from 'src/app/services/quizz.service';

@Component({
  selector: 'app-quizz-edit',
  templateUrl: './quizz-edit.component.html',
  styleUrls: ['./quizz-edit.component.css'],
})
export class QuizzEditComponent implements OnInit {
  quizz!: Quizz;
  isLoading: boolean = false;
  isAdmin = false;
  currentUser!: User;
  quizzForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: [''],
    isRandomQuestions: [''],
  });

  constructor(
    private quizzService: QuizzService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '{}');
    this.isLoading = true;
    this.authService
      .isCurrentUserAdmin()
      .subscribe((result) => (this.isAdmin = result));
    this.initQuizz(id);
  }

  initQuizz(id: number): void {
    this.quizzService.getQuizzById(id).subscribe((quizz) => {
      this.quizzForm.patchValue({
        id: quizz.id,
        name: quizz.name,
        description: quizz.description,
        isRandomQuestions: quizz.isRandomQuestions,
      });
      this.isLoading = false;
    });
  }

  onSubmit() {
    console.warn(this.quizzForm.value);
    this.saveQuizz(this.quizzForm.value);
    this.router.navigate(['/quizz']);
  }

  saveQuizz(quizz: Quizz) {
    this.quizzService.save(quizz).subscribe();
  }
}
