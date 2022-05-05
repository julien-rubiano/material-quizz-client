import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Mission } from "../models/mission.model";
import { handleError } from "./services.utils";

@Injectable()
export class MissionService {
  private missionsUrl =
    "https://devfactory-calendar.000webhostapp.com/missions";

  constructor(private http: HttpClient) {}

  getMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(`${this.missionsUrl}/read.php`).pipe(
      map(data => data),
      catchError(handleError)
    );
  }

  save(mission: Mission): Observable<Mission> {
    if (mission.id) {
      return this.update(mission);
    }
    return this.create(mission);
  }

  private create(mission: Mission): Observable<Mission> {
    return this.http
      .post<Mission>(`${this.missionsUrl}/create.php`, JSON.stringify(mission))
      .pipe(catchError(handleError));
  }

  private update(mission: Mission): Observable<Mission> {
    return this.http
      .post<Mission>(`${this.missionsUrl}/update.php`, JSON.stringify(mission))
      .pipe(catchError(handleError));
  }

  delete(mission: Mission): Observable<Mission> {
    return this.http
      .post<Mission>(`${this.missionsUrl}/delete.php`, JSON.stringify(mission))
      .pipe(catchError(handleError));
  }
}
