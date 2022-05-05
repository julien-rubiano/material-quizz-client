import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Tracking } from "../models/tracking.model";
import { handleError } from "./services.utils";

@Injectable()
export class TrackingService {
  private trackingUrl =
    "https://devfactory-calendar.000webhostapp.com/tracking";

  constructor(private http: HttpClient) { }

  getTrackings(year: number, month: number): Observable<Tracking[]> {
    return this.http
      .get<Tracking[]>(
        `${this.trackingUrl}/read.php?year=${year}&month=${month}`
      )
      .pipe(
        map(data => data),
        catchError(handleError)
      );
  }

  getTrackingByUser(userId: number): Observable<Tracking[]> {
    return this.http
      .get<Tracking[]>(`${this.trackingUrl}/read-by-user.php?userId=${userId}`)
      .pipe(
        map(data => data),
        catchError(handleError)
      );
  }

  getAbsences(): Observable<Tracking[]> {
    return this.http
      .get<Tracking[]>(`${this.trackingUrl}/read-absences.php?`)
      .pipe(
        map(data => data),
        catchError(handleError)
      );
  }

  save(tracking: Tracking): Observable<Tracking> {
    return this.http
      .post<Tracking>(
        `${this.trackingUrl}/create.php`,
        JSON.stringify(tracking)
      )
      .pipe(catchError(handleError));
  }

  delete(tracking: Tracking): Observable<Tracking> {
    return this.http
      .post<Tracking>(
        `${this.trackingUrl}/delete.php`,
        JSON.stringify(tracking)
      )
      .pipe(catchError(handleError));
  }
}
