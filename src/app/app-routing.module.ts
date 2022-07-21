import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/components/login/login.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { PageNotFoundComponent } from 'src/app/components/page-not-found/page-not-found.component';
import { FullScreenLayoutComponent } from 'src/app/components/full-screen-layout/full-screen-layout.component';
import { UsersListComponent } from 'src/app/components/users/users-list/users-list.component';
import { UsersSaveComponent } from 'src/app/components/users/users-save/users-save.component';
import { QuizzListComponent } from 'src/app/components/quizz/quizz-list/quizz-list.component';
import { MenuLayoutComponent } from 'src/app/components/menu-layout/menu-layout.component';
import { AdminGuard } from './guards/admin-guard.service';
import { AuthGuard } from './guards/auth-guard.service';
import { QuizzSaveComponent } from './components/quizz/quizz-save/quizz-save.component';
import { QuizzPlayComponent } from './components/quizz/quizz-play/quizz-play.component';

const routes: Routes = [
  {
    path: '',
    component: MenuLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      {
        path: 'users',
        component: UsersListComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'users/create',
        component: UsersSaveComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'users/edit/:id',
        component: UsersSaveComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'quizz',
        component: QuizzListComponent,
      },
      {
        path: 'quizz/create',
        component: QuizzSaveComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'quizz/edit/:id',
        component: QuizzSaveComponent,
        canActivate: [AdminGuard],
      },
    ],
  },
  {
    path: 'login',
    component: FullScreenLayoutComponent,
    children: [{ path: '', component: LoginComponent }],
  },
  {
    path: 'quizz/play/:id',
    component: FullScreenLayoutComponent,
    children: [{ path: '', component: QuizzPlayComponent }],
  },
  {
    path: '**',
    component: FullScreenLayoutComponent,
    children: [{ path: '', component: PageNotFoundComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
