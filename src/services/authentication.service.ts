import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";

@Injectable()
export class AuthenticationService {
    constructor(private apiService: ApiService) {

    }

    login(credentials: any): Observable<Response> {
        return this.apiService.post('/authentication/login', credentials);
    }

    logout(): Observable<Response> {
        return this.apiService.post('/authentication/logout');
    }

    isAuthenticated(): boolean {
        return localStorage.getItem('currentUser') !== null;
    }
}