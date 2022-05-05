import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Draggable } from "@fullcalendar/interaction";
import { MissionService } from "src/app/services/mission.service";
import { Mission } from "src/app/models/mission.model";
import { DayService } from "src/app/services/day.service";
import { TrackingService } from "src/app/services/tracking.service";
import { Tracking } from "src/app/models/tracking.model";
import { Colors } from "src/app/models/color.model";
import { AuthService } from "src/app/services/auth.service";
import { User } from "src/app/models/user.model";

@Component({
  selector: "app-cra",
  templateUrl: "./cra.component.html",
  styleUrls: ["./cra.component.css"]
})
export class CraComponent implements OnInit {
  @ViewChild("dragmissions", { static: true }) dragmissions: ElementRef;
  @ViewChild("dragothers", { static: true }) dragothers: ElementRef;
  options: any;
  missions: Mission[];
  events: EventInput[] = [];
  currentUser: User;
  colors: Colors;
  isLoading: boolean;

  constructor(
    private missionService: MissionService,
    private dayService: DayService,
    private trackingService: TrackingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.options = {
      editable: true,
      droppable: true,
      height: "parent",
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
      absence: "#eda88a",
      mission: "#5a77c5"
    };

    this.setDraggableMissions();

    this.setDraggableAbsences();

    this.getMissions();

    this.getNonWorkingDays();

    this.currentUser = this.authService.getCurrentUser();

    this.getCurrentUserTracking();
  }

  private getCurrentUserTracking() {
    this.trackingService.getTrackingByUser(this.currentUser.id).subscribe(
      trackings => {
        trackings.forEach(tracking => {
          this.addEventToCalendar({
            start: new Date(tracking.date),
            title: tracking.missionName,
            allDay: true,
            id: tracking.id,
            color: this.getTrackingColor(tracking)
          });
        });
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
      }
    );
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

  private getMissions() {
    this.missionService
      .getMissions()
      .subscribe(missions => (this.missions = missions));
  }

  private setDraggableAbsences() {
    const color = this.colors.absence;
    new Draggable(this.dragothers.nativeElement, {
      itemSelector: ".fc-other",
      eventData: function(eventEl) {
        return {
          title: eventEl.getElementsByClassName("mat-line")[0].innerHTML,
          eventBackgroundColor: color
        };
      }
    });
  }

  private setDraggableMissions() {
    const color = this.colors.mission;
    new Draggable(this.dragmissions.nativeElement, {
      itemSelector: ".fc-mission",
      eventData: function(eventEl) {
        return {
          title: eventEl.getElementsByClassName("mat-line")[0].innerHTML,
          eventBackgroundColor: color
        };
      }
    });
  }

  handleEventReceive(model) {
    const eventReceived: EventInput = {
      start: model.event.start,
      title: model.event.title,
      allDay: true
    };

    this.removeEventFromCalendar(model.event);

    const eventsForThisDay = this.events.filter(
      e =>
        new Date(e.start.toString()).getTime() ===
        new Date(eventReceived.start.toString()).getTime()
    );

    if (eventsForThisDay && eventsForThisDay.length === 2) {
      this.removeEventFromCalendar(model.event);
    } else {
      if (eventReceived.title === "Absence") {
        eventReceived.color = this.colors.absence;
      } else {
        eventReceived.color = this.colors.mission;
      }
      this.saveTracking(eventReceived);
    }
  }

  handleEventClick(model) {
    const event = model.event;
    this.deleteTracking(event);
    this.removeEventFromCalendar(event);
  }

  private saveTracking(event: EventInput) {
    const date = new Date(event.start.toString());
    let missionId: number;

    if (event.title === "Absence") {
      missionId = 1;
    } else {
      missionId = this.missions.find(m => m.name === event.title).id;
    }

    this.trackingService
      .save({
        userId: this.currentUser.id,
        missionId: missionId,
        date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      })
      .subscribe(newTracking => {
        this.addEventToCalendar({
          id: newTracking.id,
          start: event.start,
          title: event.title,
          allDay: event.allDay,
          rendering: event.rendering,
          overlap: event.overlap,
          color: event.color
        });
      });
  }

  private deleteTracking(event: EventInput) {
    this.events = this.events.filter(
      e => e.id !== parseInt(event.id.toString())
    );
    const id = event.id as number;
    this.trackingService.delete({ id: id }).subscribe();
  }

  private addEventToCalendar(event: EventInput) {
    this.events = this.events.concat(event);
  }

  private removeEventFromCalendar(event: EventInput) {
    event.remove();
  }

  private getTrackingColor(tracking: Tracking): string {
    return tracking.missionId === 1 ? this.colors.absence : this.colors.mission;
  }
}
