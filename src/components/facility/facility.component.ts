import {Component} from "@angular/core";

@Component({
    selector: 'facility',
    templateUrl: './facility.html'
})
export class FacilityComponent {
    pageHeader: string;

    constructor() {
        this.pageHeader = 'Facility Configuration Page';
    }
}