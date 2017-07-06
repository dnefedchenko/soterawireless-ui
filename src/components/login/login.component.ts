import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Response} from "@angular/http";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {NotificationService} from "../../services/notification.service";

@Component({
    selector: 'login',
    template: `
        <div class="container" *ngIf="!isAuthenticated()" >
            <form [formGroup]="loginForm" (ngSubmit)="login()" class="form-signin">
                <div class="vsm-logo"></div>
                <h2 *ngIf="sessionExpired" class="form-signin-heading">
                    <span>{{sessionExpirationNotification}}</span>
                </h2>
                <h2 *ngIf="!sessionExpired" class="form-signin-heading">
                    <span>{{signInPrompt}}</span>
                </h2>
                <div class="vsm-credential-holder">
                    <i class="vsm-credential-icon vsm-login-icon"></i>
                    <input type="text" name="loginInput" class="form-control" placeholder="Username"
                        formControlName="username" autocomplete="off" required vsm-focus>
                    <!--<span *ngIf="loginForm.loginInput.$error.required && loginForm.loginInput.$dirty" class="error-message">Username is required field</span>-->
                </div>
        
                <div class="vsm-credential-holder">
                    <i class="vsm-credential-icon vsm-password-icon"></i>
                    <input type="password" name="passwordInput" class="form-control" placeholder="Password" formControlName="password" 
                        autocomplete="off" required (keyup)="$event.keyCode == 13 && login()">
                    <!--<span *ngIf="loginForm.passwordInput.$error.required && loginForm.passwordInput.$dirty" class="error-message">Password is required field</span>-->
                </div>
        
                <div>
                    <!--<span *ngIf="loginModel.authenticationFailed" class="error-message">Username or password incorrect</span>-->
                </div>
        
                <div class="checkbox">
                    <label class="vsm-remember-me">
                        <input type="checkbox" value="remember-me"> Remember me
                    </label>
                </div>
        
                <button class="btn btn-lg btn-primary btn-block" type="submit" [disabled]="!loginForm.valid">Sign in</button>
            </form>
        </div>
    `
})
export class LoginComponent implements OnInit {
    authenticationFailed: boolean;
    sessionExpired: boolean;

    loginForm: FormGroup;

    constructor(private authenticationService: AuthenticationService,
                private notificationService: NotificationService,
                private formBuilder: FormBuilder, private router: Router) {

    }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group(
            {
                username: ['', Validators.required],
                password: ['', Validators.required]
            }
        );
    }

    login(): void {
        this.authenticationService
            .login(this.loginForm.value)
            .subscribe(
                (response: Response) => {
                    if (response.json()) {
                        localStorage.setItem("currentUser", JSON.stringify(response.json()));
                        this.router.navigateByUrl('/clinical-configuration');
                        this.authenticationFailed = false;
                        this.sessionExpired = false;
                        this.notificationService.showSuccessNotification("You're logged in as ".concat(response.json().username), "Welcome!")
                    } else {
                        this.handleError();
                    }
                },
                (error: any) => {
                    this.handleError();
                }
            );
    }

    private handleError() {
        this.router.navigateByUrl('login');
        this.authenticationFailed = true;
        this.sessionExpired = true;
        this.notificationService.showErrorNotification("Authentication failure", "Failure");
    }

    isAuthenticated(): boolean {
        return this.authenticationService.isAuthenticated();
    }
}