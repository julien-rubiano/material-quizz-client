import { HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';

export function handleError(res: HttpErrorResponse | any): Observable<never> {
  console.error(res.error || res.body.error);
  return observableThrowError(res.error || 'Server error');
}
