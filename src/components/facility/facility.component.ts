import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

@Component({
    selector: 'facility',
    templateUrl: './facility.html'
})
export class FacilityComponent implements OnInit {
    facilityForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.facilityForm = this.formBuilder.group({
            name: ['', Validators.required],
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