import {Component} from "@angular/core";
import {AuthenticationService} from "../../services/authentication.service";
import {Response} from "@angular/http";
import {Router} from "@angular/router";

@Component({
  selector: 'vsm',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class VsmAppComponent {
    constructor(private authenticationService: AuthenticationService, private router: Router) {

    }

    isAuthenticated(): boolean {
        return this.authenticationService.isAuthenticated();
    }

    logout(): void {
        this.authenticationService
            .logout()
            .subscribe(
                (response: Response) => {
                    localStorage.removeItem('currentUser')
                    this.router.navigateByUrl('/login');
                },
                (error: any) => {
                    console.log('Failed to log out user');
                }
            );
    }
}
