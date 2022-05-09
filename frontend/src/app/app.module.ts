import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { UserService } from './services/user.service';
import { AuthGuard } from './guards/auth-guard.service';
import { QuizzService } from './services/quizz.service';
import { AdminGuard } from './guards/admin-guard.service';
import { AppComponent } from './app.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { PageNotFoundComponent } from 'src/app/components/page-not-found/page-not-found.component';
import { FullScreenLayoutComponent } from 'src/app/components/full-screen-layout/full-screen-layout.component';
import { UsersListComponent } from 'src/app/components/users/users-list/users-list.component';
import { QuizzListComponent } from 'src/app/components/quizz/quizz-list/quizz-list.component';
import { UsersCreateComponent } from 'src/app/components/users/users-create/users-create.component';
import { QuizzCreateComponent } from 'src/app/components/quizz/quizz-create/quizz-create.component';
import { MenuLayoutComponent } from 'src/app/components/menu-layout/menu-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { QuizzEditComponent } from './components/quizz/quizz-edit/quizz-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    FullScreenLayoutComponent,
    MenuLayoutComponent,
    UsersListComponent,
    QuizzListComponent,
    UsersCreateComponent,
    QuizzCreateComponent,
    DashboardComponent,
    QuizzEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatInputModule,
    MatTableModule,
    MatExpansionModule,
    MatCardModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  providers: [UserService, QuizzService, AuthGuard, AdminGuard],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
