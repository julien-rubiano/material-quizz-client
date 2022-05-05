import { AuthService } from "../services/auth.service";
import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.isCurrentUserAdmin().pipe(
      map(isAdmin => {
        if (!isAdmin) {
          return this.router.parseUrl("/404");
        }

        return true;
      })
    );
  }
}
