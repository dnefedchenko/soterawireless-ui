import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {Response} from "@angular/http";

@Component({
    selector: 'facility',
    templateUrl: './facility.html'
})
export class FacilityComponent implements OnInit {
    pageLoadingComplete: boolean = false;

    facility: any;
    facilityForm: FormGroup;

    constructor(private apiService: ApiService, private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.getMainFacility();
    }

    private getMainFacility(): void {
        this.apiService
            .get("/facility-units/main-facility-unit")
            .subscribe(
                (response: Response) => {
                    this.facility = response.json();
                    this.initFacilityForm();

                    this.pageLoadingComplete = true;
                },
                (error: any) => {
                    console.log('Failed to get main facility unit');
                });
    }

    private initFacilityForm(): void {
        this.facilityForm = this.formBuilder.group({
            name: [this.facility.name, Validators.required],
            adtEnabled: false,
            nonAdtRequiredFieldLabel: '',
            temperatureDisplay: '',
            temperatureUnitsOfMeasure: '',
            respirationDisplay: '',
            bloodPressureUnitsOfMeasure: '',
            dateFormat: '',
            timeFormat: '',
            rvdAdminPinCodeValue: '',
            accessTimeout: '',
            filterFrequency: '',
            screenTimeout: '',
            customDelay: '',
            clinicianPinCodeValue: '',
            arrhythmiaAlarmsEnabled: '',
            postureAlarmsEnabled: ''
        });
    }
}