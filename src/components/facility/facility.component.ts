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
            adtEnabled: [this.facility.adtEnabled],
            nonAdtRequiredFieldLabel: [this.facility.nonAdtRequiredFieldLabel],
            temperatureDisplay: [this.facility.temperatureDisplay],
            temperatureUnitsOfMeasure: [this.facility.temperatureUnitsOfMeasure],
            respirationDisplay: [this.facility.respirationDisplay],
            bloodPressureUnitsOfMeasure: [this.facility.bloodPressureUnitsOfMeasure],
            dateFormat: [this.facility.dateFormat],
            timeFormat: [this.facility.timeFormat],
            rvdAdminPinCodeValue: [this.facility.rvdAdminPinCodeValue],
            accessTimeout: [this.facility.accessTimeout],
            filterFrequency: [this.facility.filterFrequency],
            screenTimeout: [this.facility.screenTimeout],
            customDelay: [this.facility.customDelay],
            clinicianPinCodeValue: [this.facility.clinicianPinCodeValue],
            arrhythmiaAlarmsEnabled: [this.facility.arrhythmiaAlarmsEnabled],
            postureAlarmsEnabled: [this.facility.postureAlarmsEnabled]
        });
    }
}