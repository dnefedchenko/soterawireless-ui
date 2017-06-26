import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {Response} from "@angular/http";

function pinValidator(control: FormControl): {[s: string]: boolean} {
    if (control && !control.value.match(/^\d{4,8}$/)) {
        return {'pinCodeMismatch': true}
    }
}

@Component({
    selector: 'facility',
    templateUrl: './facility.html'
})
export class FacilityComponent implements OnInit {
    DEFAULT_PIN_CODE_VALUE: string = '0000';

    NOT_FOUND_STATUS: number = 404;
    UNAUTHORIZED_STATUS: number = 401;

    pageLoadingComplete: boolean = false;

    temperatureUnitOptions: Array<any>;
    bloodPressureUnitOptions: Array<any>;
    dateFormatOptions: Array<any>;
    timeFormatOptions: Array<any>;
    accessTimeoutOptions: Array<any>;
    noiseFrequencyOptions: Array<any>;
    screenTimeoutOptions: Array<any>;
    customDelayOptions: Array<any>;

    facility: any;
    facilityForm: FormGroup;

    constructor(private apiService: ApiService, private formBuilder: FormBuilder) {
        this.temperatureUnitOptions = [
            {name: 'Celsius'},
            {name: 'Fahrenheit'}
        ];

        this.bloodPressureUnitOptions = [
            {name: 'mmHg'},
            {name: 'kPa'}
        ];

        this.dateFormatOptions  = [
            {name: 'MON_DD_YYYY', alias: 'MMM dd, yyyy'},
            {name: 'DD_MON_YYYY', alias: 'dd MMM yyyy'},
            {name: 'MM_DD_YYYY', alias: 'MM/dd/yyyy'},
            {name: 'DD_MM_YYYY', alias: 'dd/MM/yyyy'}
        ];

        this.timeFormatOptions = [
            {name: 'HOUR_12', alias: '12 Hour'},
            {name: 'HOUR_24', alias: '24 Hour'}
        ];

        this.accessTimeoutOptions = [
            {name: 'ONE_MINUTE', alias: '1min'},
            {name: 'TWO_MINUTES', alias: '2min'},
            {name: 'THREE_MINUTES', alias: '3min'},
            {name: 'FOUR_MINUTES', alias: '4min'},
            {name: 'FIVE_MINUTES', alias: '5min'},
            {name: 'SIX_MINUTES', alias: '6min'},
            {name: 'SEVEN_MINUTES', alias: '7min'},
            {name: 'EIGHT_MINUTES', alias: '8min'},
            {name: 'NINE_MINUTES', alias: '9min'},
            {name: 'TEN_MINUTES', alias: '10min'}
        ];

        this.noiseFrequencyOptions = [
            {name: 'SIXTY', alias: '60 Hz'},
            {name: 'FIFTY', alias: '50 Hz'}
        ];

        this.screenTimeoutOptions = [
            {alias: 'Off', name: 'OFF'},
            {alias: '15sec', name: 'FIFTEEN_SECONDS'},
            {alias: '30sec', name: 'THIRTY_SECONDS'},
            {alias: '1min', name: 'ONE_MINUTE'},
            {alias: '3min', name: 'THREE_MINUTES'}
        ];

        this.customDelayOptions = [
            {name: '0', alias: 'Default',},
            {name: '1', alias: 'Wake Forest'}
        ];
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

                    this.watchAdt();

                    this.pageLoadingComplete = true;
                },
                (error: any) => {
                    if (error.status === this.NOT_FOUND_STATUS) {
                        this.initDefaultFacilityForm();

                        this.pageLoadingComplete = true;
                    } else {
                        if (error.status !== this.UNAUTHORIZED_STATUS) {
                            // NotificationService.showErrorNotification('Failed to load facility configuration.');
                        }
                        // $location.path('/error-page');
                    }
                });
    }

    private initFacilityForm(): void {
        this.facilityForm = this.formBuilder.group({
            id: this.facility.id,
            name: [this.facility.name, Validators.required],
            adtEnabled: [this.facility.adtEnabled],
            nonAdtRequiredFieldLabel: [{value: this.facility.nonAdtRequiredFieldLabel, disabled: this.facility.adtEnabled}],
            temperatureDisplay: [this.facility.temperatureDisplay],
            temperatureUnitsOfMeasure: [this.facility.temperatureUnitsOfMeasure],
            respirationDisplay: [this.facility.respirationDisplay],
            bloodPressureUnitsOfMeasure: [this.facility.bloodPressureUnitsOfMeasure],
            dateFormat: [this.facility.dateFormat],
            timeFormat: [this.facility.timeFormat],
            rvdAdminPinCodeValue: [this.facility.rvdAdminPinCodeValue, Validators.compose([pinValidator])],
            accessTimeout: [this.facility.accessTimeout],
            filterFrequency: [this.facility.filterFrequency],
            screenTimeout: [this.facility.screenTimeout],
            customDelay: [this.facility.customDelay],
            clinicianPinCodeValue: [{value: this.facility.clinicianPinCodeValue, disabled: this.facility.clinicianPinCodeValue === null}],
            arrhythmiaAlarmsEnabled: [this.facility.arrhythmiaAlarmsEnabled],
            postureAlarmsEnabled: [this.facility.postureAlarmsEnabled]
        });
    }

    private initDefaultFacilityForm(): void {
        this.facilityForm = this.formBuilder.group({
            name: ['Sotera Medical', Validators.required],
            adtEnabled: false,
            nonAdtRequiredFieldLabel: 'MRN',
            temperatureDisplay: true,
            temperatureUnitsOfMeasure: this.temperatureUnitOptions[1].name,
            respirationDisplay: true,
            bloodPressureUnitsOfMeasure: this.bloodPressureUnitOptions[0].name,
            dateFormat: this.dateFormatOptions[0].name,
            timeFormat: this.timeFormatOptions[1].name,
            rvdAdminPinCodeValue: ['0000', Validators.compose([pinValidator])],
            accessTimeout: this.accessTimeoutOptions[9].name,
            filterFrequency: this.noiseFrequencyOptions[1].name,
            screenTimeout: this.screenTimeoutOptions[4].name,
            customDelay: this.customDelayOptions[0].name,
            clinicianPinCodeValue: '',
            arrhythmiaAlarmsEnabled: false,
            postureAlarmsEnabled: false
        });
    }

    facilityExists(): boolean {
        return this.facility && this.facility.id !== null && this.facility.id !== undefined;
    }

    watchAdt(): void {
        this.facilityForm.get('adtEnabled').valueChanges.subscribe(newValue => {
            let adtInput = this.facilityForm.get('nonAdtRequiredFieldLabel');
            newValue ? adtInput.disable() : adtInput.enable();
        });
    }

    toggleClinicianInput(checked: boolean): void {
        let pinCodeControl = this.facilityForm.get('clinicianPinCodeValue');
        checked ? pinCodeControl.enable() : pinCodeControl.disable();
        if (pinCodeControl.value === null) {
            pinCodeControl.setValue(this.DEFAULT_PIN_CODE_VALUE);
        }
    }

    onSubmit(): void {
        this.prepareBeforeSubmit();

        if (this.facilityExists()) {
            this.updateFacility();
        } else {
            this.createFacility();
        }
    }

    private updateFacility() {
        this.apiService
            .put('/facility-units', this.facilityForm.value)
            .subscribe(
                (response: Response) => {
                    console.log('Facility has been updated successfully');
                },
                (error: any) => {
                    console.log('Failed to update facility');
                });
    }

    private createFacility() {
        this.apiService
            .post('/facility-units', this.facilityForm.value)
            .subscribe(
                (response: Response) => {
                    console.log('Facility has been successfully created');
                },
                (error: any) => {
                    console.log('Failed to create new facility');
                });
    }

    private prepareBeforeSubmit() {
        this.facilityForm.get('temperatureDisplay').setValue(this.facilityForm.get('temperatureDisplay').value ? 'On' : 'Off');
        this.facilityForm.get('respirationDisplay').setValue(this.facilityForm.get('respirationDisplay').value ? 'On' : 'Off');
    }
}