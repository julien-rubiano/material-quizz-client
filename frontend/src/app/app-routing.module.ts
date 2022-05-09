import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/components/login/login.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { PageNotFoundComponent } from 'src/app/components/page-not-found/page-not-found.component';
import { FullScreenLayoutComponent } from 'src/app/components/full-screen-layout/full-screen-layout.component';
import { UsersListComponent } from 'src/app/components/users/users-list/users-list.component';
import { UsersCreateComponent } from 'src/app/components/users/users-create/users-create.component';
import { QuizzListComponent } from 'src/app/components/quizz/quizz-list/quizz-list.component';
import { QuizzCreateComponent } from 'src/app/components/quizz/quizz-create/quizz-create.component';
import { MenuLayoutComponent } from 'src/app/components/menu-layout/menu-layout.component';
import { AdminGuard } from './guards/admin-guard.service';
import { AuthGuard } from './guards/auth-guard.service';
import { QuizzEditComponent } from './components/quizz/quizz-edit/quizz-edit.component';

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
        component: UsersCreateComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'quizz',
        component: QuizzListComponent,
      },
      {
        path: 'quizz/create',
        component: QuizzCreateComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'quizz/edit/:id',
        component: QuizzEditComponent,
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
