import {Component, ElementRef, Renderer2, AfterContentChecked} from "@angular/core";
import {AuthenticationService} from "../../services/authentication.service";
import {Response} from "@angular/http";
import {Router} from "@angular/router";

@Component({
    selector: '[vsm]',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class VsmAppComponent implements AfterContentChecked {
    backgroundCss: string = 'login-background';

    constructor(private renderer: Renderer2, private elementRef: ElementRef, private authenticationService: AuthenticationService, private router: Router) {

    }

    ngAfterContentChecked(): void {
        if (this.isAuthenticated()) {
            this.renderer.removeClass(this.elementRef.nativeElement, this.backgroundCss);
        } else {
            this.renderer.addClass(this.elementRef.nativeElement, this.backgroundCss);
        }
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
