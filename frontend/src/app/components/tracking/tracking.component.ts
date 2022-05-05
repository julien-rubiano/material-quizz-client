import { Component, OnInit } from "@angular/core";
import {
  Tracking,
  TrackingByUser,
  TrackingMission
} from "src/app/models/tracking.model";
import { TrackingService } from "src/app/services/tracking.service";
import { MONTHS, YEARS } from "src/app/models/constants.model";

@Component({
  selector: "app-tracking",
  templateUrl: "./tracking.component.html",
  styleUrls: ["./tracking.component.css"]
})
export class TrackingComponent implements OnInit {
  trackingsByUsers: TrackingByUser[] = [];
  years = YEARS;
  months = MONTHS;
  selectedYear: number;
  selectedMonth: number;
  isLoading: boolean;
  hasError: boolean;

  constructor(private trackingService: TrackingService) {}

  ngOnInit() {
    this.isLoading = true;
    this.selectedYear = new Date().getFullYear();
    this.selectedMonth = new Date().getMonth() + 1;
    this.getTrackings(this.selectedYear, this.selectedMonth);
  }

  getTrackings(year: number, month: number): void {
    this.isLoading = true;
    this.trackingService.getTrackings(year, month).subscribe(
      trackings => {
        this.trackingsByUsers = this.convertToTrackingsByUsers(trackings);
        this.hasError = false;
        this.isLoading = false;
      },
      error => {
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  convertToTrackingsByUsers(trackings: Tracking[]): TrackingByUser[] {
    const groupsByUser: any = trackings.reduce((userGroups, newTracking) => {
      const userGroup = userGroups[newTracking.userName] || [];

      const missionGroup = userGroup[newTracking.missionName] || [];
      missionGroup.push(newTracking.date);
      userGroup[newTracking.missionName] = missionGroup;

      userGroups[newTracking.userName] = userGroup;
      return userGroups;
    }, {});

    let usersTrackings: TrackingByUser[] = [];

    for (let [user, missions] of Object.entries(groupsByUser)) {
      let userTracking: TrackingByUser = {
        user: user,
        missions: []
      };

      for (let [name, dates] of Object.entries(missions)) {
        userTracking.missions.push({
          name: name,
          daysCount: 0.5 * dates.length
        });
      }
      usersTrackings.push(userTracking);
    }

    return usersTrackings;
  }

  onMonthChange(event: any) {
    this.selectedMonth = event.value;
    this.getTrackings(this.selectedYear, this.selectedMonth);
  }

  onYearChange(event: any) {
    this.selectedYear = event.value;
    this.getTrackings(this.selectedYear, this.selectedMonth);
  }

  getColor(mission: TrackingMission) {
    return this.isAbsence(mission) ? "#eda88a" : "#5a77c5";
  }

  getIcon(mission: TrackingMission) {
    return this.isAbsence(mission) ? "hotel" : "work";
  }

  private isAbsence(mission: TrackingMission) {
    return mission.name === "Absence";
  }
}
