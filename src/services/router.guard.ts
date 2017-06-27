import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {AuthenticationService} from "./authentication.service";
import {Injectable} from "@angular/core";

@Injectable()
export class RouterGuard implements CanActivate {
    constructor(private authenticationService: AuthenticationService, private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
        let authenticated: boolean = false;
        if (this.authenticationService.isAuthenticated()) {
            authenticated = true;
        } else {
            this.router.navigate(["login"]);
        }
        return authenticated;
    }
}