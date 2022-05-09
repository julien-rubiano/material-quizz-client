import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuizzService } from 'src/app/services/quizz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quizz-create',
  templateUrl: './quizz-create.component.html',
  styleUrls: ['./quizz-create.component.css'],
})
export class QuizzCreateComponent {
  quizzForm: FormGroup;

  constructor(
    private quizzService: QuizzService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.quizzForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  onSubmit(formData: any) {
    if (this.quizzForm.status === 'VALID') {
      this.quizzService.save(formData).subscribe();
      this.router.navigate(['/quizz']);
    }
  }
}
