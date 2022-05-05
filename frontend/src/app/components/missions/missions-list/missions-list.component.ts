import { Component, OnInit } from "@angular/core";
import { Mission } from "src/app/models/mission.model";
import { MissionService } from "src/app/services/mission.service";
import { User } from "src/app/models/user.model";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-missions-list",
  templateUrl: "./missions-list.component.html",
  styleUrls: ["./missions-list.component.css"]
})
export class MissionsListComponent implements OnInit {
  missions: Mission[];
  isLoading: boolean;
  isAdmin = false;
  currentUser: User;

  constructor(
    private missionService: MissionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.authService
      .isCurrentUserAdmin()
      .subscribe(result => (this.isAdmin = result));
    this.getMissions();
  }

  getMissions(): void {
    this.missionService.getMissions().subscribe(missions => {
      this.missions = missions;
      this.isLoading = false;
    });
  }

  onEditName(event, mission: Mission) {
    mission.name = event.target.value;
    this.missionService.save(mission).subscribe();
  }

  onEditCode(event, mission: Mission) {
    mission.code = event.target.value;
    this.missionService.save(mission).subscribe();
  }

  onEditStartDate(event, mission: Mission) {
    mission.startDate = event.target.value;
    this.missionService.save(mission).subscribe();
  }

  onEditTechnologies(event, mission: Mission) {
    mission.technologies = event.target.value;
    this.missionService.save(mission).subscribe();
  }

  onDelete(mission: Mission) {
    this.missionService.delete(mission).subscribe();
    this.getMissions();
  }
}
