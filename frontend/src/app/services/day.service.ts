import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Day } from "../models/day.model";
import { handleError } from "./services.utils";

@Injectable()
export class DayService {
  private daysUrl =
    "https://devfactory-calendar.000webhostapp.com/non-working-days";

  constructor(private http: HttpClient) {}

  getNonWorkingDays(): Observable<Day[]> {
    return this.http.get<Day[]>(`${this.daysUrl}/read.php`).pipe(
      map(data => data),
      catchError(handleError)
    );
  }
}
