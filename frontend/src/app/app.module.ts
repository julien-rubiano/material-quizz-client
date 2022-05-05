import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import {
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatGridListModule,
  MatCheckboxModule,
  MatChipsModule,
  MatExpansionModule,
  MatSelectModule,
  MatProgressSpinnerModule
} from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FullCalendarModule } from "@fullcalendar/angular";
import { AppRoutingModule } from "./app-routing.module";
import { UserService } from "./services/user.service";
import { AuthGuard } from "./guards/auth-guard.service";
import { MissionService } from "./services/mission.service";
import { DayService } from "./services/day.service";
import { TrackingService } from "./services/tracking.service";
import { AdminGuard } from "./guards/admin-guard.service";
import { AppComponent } from "./app.component";
import { LoginComponent } from "src/app/components/login/login.component";
import { PageNotFoundComponent } from "src/app/components/page-not-found/page-not-found.component";
import { FullScreenLayoutComponent } from "src/app/components/full-screen-layout/full-screen-layout.component";
import { UsersListComponent } from "src/app/components/users/users-list/users-list.component";
import { MissionsListComponent } from "src/app/components/missions/missions-list/missions-list.component";
import { CraComponent } from "src/app/components/cra/cra.component";
import { TrackingComponent } from "src/app/components/tracking/tracking.component";
import { BillingComponent } from "src/app/components/billing/billing.component";
import { UsersCreateComponent } from "src/app/components/users/users-create/users-create.component";
import { MissionsCreateComponent } from "src/app/components/missions/missions-create/missions-create.component";
import { MenuLayoutComponent } from "src/app/components/menu-layout/menu-layout.component";
import { AbsencesComponent } from "src/app/components/absences/absences.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    FullScreenLayoutComponent,
    MenuLayoutComponent,
    UsersListComponent,
    MissionsListComponent,
    CraComponent,
    TrackingComponent,
    BillingComponent,
    UsersCreateComponent,
    MissionsCreateComponent,
    AbsencesComponent
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
    FullCalendarModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatCheckboxModule,
    MatChipsModule,
    MatInputModule,
    MatExpansionModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  providers: [
    UserService,
    MissionService,
    DayService,
    TrackingService,
    AuthGuard,
    AdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
