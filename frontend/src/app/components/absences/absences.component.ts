import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import { DayService } from "src/app/services/day.service";
import { TrackingService } from "src/app/services/tracking.service";
import { Colors } from "src/app/models/color.model";
import { UserService } from "src/app/services/user.service";
import { User } from "src/app/models/user.model";

@Component({
  selector: "app-absences",
  templateUrl: "./absences.component.html",
  styleUrls: ["./absences.component.css"]
})
export class AbsencesComponent implements OnInit {
  options: any;
  events: EventInput[] = [];
  initEvents: EventInput[] = [];
  colors: Colors;
  users: User[];
  selectedUsers = new FormControl();
  isLoading: boolean;

  constructor(
    private userService: UserService,
    private dayService: DayService,
    private trackingService: TrackingService
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.options = {
      editable: false,
      droppable: false,
      header: {
        left: "prev,next",
        center: "title",
        right: ""
      },
      plugins: [dayGridPlugin],
      weekends: false,
      locale: "fr",
      eventOverlap: true
    };

    this.colors = {
      nonWorkingDay: "#dddddd",
      absence: "#eda88a"
    };

    this.getUsers();

    this.getAbsences();

    this.getNonWorkingDays();
  }

  private getAbsences() {
    this.trackingService.getAbsences().subscribe(trackings => {
      trackings.forEach(tracking => {
        this.addEventToCalendar({
          start: new Date(tracking.date),
          title: tracking.userName,
          allDay: true,
          id: tracking.userId,
          color: this.colors.absence
        });
      });
      this.isLoading = false;
    });
  }

  private getNonWorkingDays() {
    this.dayService.getNonWorkingDays().subscribe(days => {
      days.forEach(day => {
        this.addEventToCalendar({
          start: new Date(day.date),
          allDay: true,
          rendering: "background",
          overlap: false,
          color: this.colors.nonWorkingDay
        });
      });
    });
  }

  private getUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      const allUserIds = users.map(u => u.id);
      this.selectedUsers.setValue(allUserIds);
    });
  }

  private addEventToCalendar(event: EventInput) {
    this.initEvents = this.initEvents.concat(event);
    this.events = this.events.concat(event);
  }

  onUserChange(event) {
    this.events = this.initEvents.filter(e =>
      event.value.includes(parseInt(e.id as string))
    );
  }

  getUserName(user: User) {
    return `${user.firstName} ${user.lastName}`;
  }
}
