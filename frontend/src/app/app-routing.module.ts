import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "src/app/components/login/login.component";
import { PageNotFoundComponent } from "src/app/components/page-not-found/page-not-found.component";
import { FullScreenLayoutComponent } from "src/app/components/full-screen-layout/full-screen-layout.component";
import { CraComponent } from "src/app/components/cra/cra.component";
import { UsersListComponent } from "src/app/components/users/users-list/users-list.component";
import { UsersCreateComponent } from "src/app/components/users/users-create/users-create.component";
import { MissionsListComponent } from "src/app/components/missions/missions-list/missions-list.component";
import { MissionsCreateComponent } from "src/app/components/missions/missions-create/missions-create.component";
import { TrackingComponent } from "src/app/components/tracking/tracking.component";
import { BillingComponent } from "src/app/components/billing/billing.component";
import { MenuLayoutComponent } from "src/app/components/menu-layout/menu-layout.component";
import { AbsencesComponent } from "src/app/components/absences/absences.component";
import { AdminGuard } from "./guards/admin-guard.service";
import { AuthGuard } from "./guards/auth-guard.service";

const routes: Routes = [
  {
    path: "",
    component: MenuLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", component: CraComponent },
      {
        path: "users",
        component: UsersListComponent,
        canActivate: [AdminGuard]
      },
      {
        path: "users/create",
        component: UsersCreateComponent,
        canActivate: [AdminGuard]
      },
      {
        path: "missions",
        component: MissionsListComponent
      },
      {
        path: "missions/create",
        component: MissionsCreateComponent,
        canActivate: [AdminGuard]
      },
      {
        path: "tracking",
        component: TrackingComponent,
        canActivate: [AdminGuard]
      },
      {
        path: "billing",
        component: BillingComponent,
        canActivate: [AdminGuard]
      },
      {
        path: "absences",
        component: AbsencesComponent
      }
    ]
  },
  {
    path: "login",
    component: FullScreenLayoutComponent,
    children: [{ path: "", component: LoginComponent }]
  },
  {
    path: "**",
    component: FullScreenLayoutComponent,
    children: [{ path: "", component: PageNotFoundComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
