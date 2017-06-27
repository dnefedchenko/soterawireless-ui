import {BrowserXhr} from "@angular/http";
import {Injectable} from "@angular/core";
/**
 *  This class intended to allow CORS requests with credentials globally.
 */
@Injectable()
export class CorsService extends BrowserXhr {
    constructor() {
        super();
    }

    build(): any {
        let xhr = super.build();
        xhr.withCredentials = true;
        return <any>(xhr);
    }
}