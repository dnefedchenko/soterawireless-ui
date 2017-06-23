import {Http, Response, RequestOptions, Headers} from "@angular/http";
import {Observable} from "rxjs";

export class QueryParameter {
    public key: string;
    public value: string;

    constructor(key: any, value: any) {
        this.key = key;
        this.value = value;
    }
}

export class ApiService {
    private requestOptions: RequestOptions;

    constructor(private apiUrl: string, private http: Http) {
        this.requestOptions = new RequestOptions({withCredentials: true});
    }

    get(url: string, params?: Array<QueryParameter>, headers?: Headers): Observable<Response> {
        let queryParameters = params && params.length > 0 ? this.buildQueryParams(params) : "";
        if (headers) {
            this.requestOptions.headers = headers;
        }
        return this.http.get(this.apiUrl.concat(url).concat(queryParameters), this.requestOptions);
    }

    buildQueryParams(params: Array<QueryParameter>): string {
        let queryString: string = "?";

        params.forEach((parameter: QueryParameter) => {
            if (queryString.length > 1) queryString = queryString.concat("&");
            queryString = queryString.concat(parameter.key, "=", parameter.value);
        });
        return queryString;
    }

    post(url: string, payload?: any): Observable<Response> {
        return this.http.post(this.apiUrl.concat(url), payload);
    }

    put(url: string, payload?: any): Observable<Response> {
        return this.http.put(this.apiUrl.concat(url), payload);
    }

    delete(url: string, params?: Array<QueryParameter>): Observable<Response> {
        let queryParameters = params && params.length > 0 ? this.buildQueryParams(params) : "";
        return this.http.delete(this.apiUrl.concat(url).concat(queryParameters));
    }
}