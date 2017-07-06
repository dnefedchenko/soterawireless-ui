import {Component, ElementRef, Renderer2, AfterContentChecked, ViewContainerRef} from "@angular/core";
import {AuthenticationService} from "../../services/authentication.service";
import {Response} from "@angular/http";
import {Router} from "@angular/router";
import {ToastsManager} from "ng2-toastr";
import {NotificationService} from "../../services/notification.service";

@Component({
    selector: '[vsm]',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class VsmAppComponent implements AfterContentChecked {
    backgroundCss: string = 'login-background';

    constructor(private renderer: Renderer2,
                private elementRef: ElementRef,
                private authenticationService: AuthenticationService,
                private notificationService: NotificationService,
                private router: Router,
                public toastr: ToastsManager,
                viewContainerRef: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(viewContainerRef);
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
                    this.notificationService.showErrorNotification("Failed to log out from application", "Failure");
                }
            );
    }
}
