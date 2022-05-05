import { Component, OnInit } from "@angular/core";
import { TrackingService } from "src/app/services/tracking.service";
import { YEARS, MONTHS } from "src/app/models/constants.model";
import { TrackingByMission, Tracking } from "src/app/models/tracking.model";

@Component({
  selector: "app-billing",
  templateUrl: "./billing.component.html",
  styleUrls: ["./billing.component.css"]
})
export class BillingComponent implements OnInit {
  trackingsByMissions: TrackingByMission[] = [];
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
        this.trackingsByMissions = this.convertToTrackingsByMissions(trackings);
        this.hasError = false;
        this.isLoading = false;
      },
      error => {
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  convertToTrackingsByMissions(trackings: Tracking[]): TrackingByMission[] {
    const groupsByMission: any = trackings.reduce(
      (missionGroups, newTracking) => {
        const missionGroup = missionGroups[newTracking.missionName] || [];

        const userGroup = missionGroup[newTracking.userName] || [];
        userGroup.push({
          date: newTracking.date,
          cost: newTracking.userCost
        });
        missionGroup[newTracking.userName] = userGroup;

        missionGroups[newTracking.missionName] = missionGroup;
        return missionGroups;
      },
      {}
    );

    let usersTrackings: TrackingByMission[] = [];

    for (let [mission, users] of Object.entries(groupsByMission)) {
      let missionTracking: TrackingByMission = {
        mission: mission,
        users: []
      };

      for (let [name, dates] of Object.entries(users)) {
        missionTracking.users.push({
          name: name,
          daysCount: 0.5 * dates.length,
          daysCost: dates.reduce(function(a, b) {
            return a + b.cost;
          }, 0)
        });
      }

      missionTracking.totalCost = missionTracking.users.reduce(function(a, b) {
        return a + b.daysCost;
      }, 0);
      usersTrackings.push(missionTracking);
    }
    return usersTrackings.filter(t => t.mission !== "Absence");
  }

  onMonthChange(event: any) {
    this.selectedMonth = event.value;
    this.getTrackings(this.selectedYear, this.selectedMonth);
  }

  onYearChange(event: any) {
    this.selectedYear = event.value;
    this.getTrackings(this.selectedYear, this.selectedMonth);
  }
}
