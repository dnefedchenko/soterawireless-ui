import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {Response} from "@angular/http";
import {NotificationService} from "../../services/notification.service";
import {FileUploader} from "ng2-file-upload/index";
import {environment} from "../../environments/environment";

function pinValidator(control: FormControl): {[s: string]: boolean} {
    if (control && !control.value.match(/^\d{4,8}$/)) {
        return {'pinCodeMismatch': true}
    }
}

@Component({
    selector: 'clinical-configuration',
    templateUrl: 'clinical-configuration.html'
})
export class ClinicalConfigurationComponent implements OnInit {
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

    locationsUploader: FileUploader;
    configurationUploader: FileUploader;

    hasLocationDropOver: boolean = false;
    hasConfigurationDropOver: boolean = false;

    careUnits: Array<any> = [];

    showCareUnitCreationForm: boolean = false;
    mmHgCareUnit: any;
    kPaCareUnit: any;

    constructor(private apiService: ApiService, private notificationService: NotificationService, private formBuilder: FormBuilder) {
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

        this.locationsUploader = new FileUploader({url: environment.apiUrl.concat('/upload-locations')});
        this.configurationUploader = new FileUploader({url: environment.apiUrl.concat('/upload-configuration')});

        this.mmHgCareUnit = {
            "name": "",
            "alarmLimits": [
                {"label": "HR/PR (BPM)", "low": "30", "high": "150", "lowBoundary": "30", "highBoundary": "200"},
                {"label": "Systolic BP", "low": "OFF", "high": "190", "lowBoundary": "70", "highBoundary": "240"},
                {"label": "Diastolic BP", "low": "OFF", "high": "OFF", "lowBoundary": "40", "highBoundary": "150"},
                {"label": "MAP", "low": "60", "high": "OFF", "lowBoundary": "58", "highBoundary": "170"},
                {"label": "Respiration", "low": "4", "high": "35", "lowBoundary": "4", "highBoundary": "40"},
                {"label": "SpO2", "low": "85", "high": "", "lowBoundary": "80", "highBoundary": ""}
            ],
            "fallDetection": false,
            "inactivityAlarm": false,
            "enabled": true,
            "afibCvrEnabled": false,
            "afibRvrEnabled": false,
            "afibRvrHeartRateLimit": 100,
            "vtachVfibEnabled": false,
            "asysEnabled": true
        };

        this.kPaCareUnit = {
            "name": "",
            "alarmLimits": [
                {"label": "HR/PR (BPM)", "low": "30", "high": "150", "lowBoundary": "30", "highBoundary": "200"},
                {"label": "Systolic BP", "low": "OFF", "high": "25.3", "lowBoundary": "8.0", "highBoundary": "31.9"},
                {"label": "Diastolic BP", "low": "OFF", "high": "OFF", "lowBoundary": "5.4", "highBoundary": "21.3"},
                {"label": "MAP", "low": "8.0", "high": "OFF", "lowBoundary": "6.7", "highBoundary": "24.6"},
                {"label": "Respiration", "low": "4", "high": "35", "lowBoundary": "4", "highBoundary": "40"},
                {"label": "SpO2", "low": "85", "high": "", "lowBoundary": "80", "highBoundary": ""}
            ],
            "fallDetection": false,
            "inactivityAlarm": false,
            "enabled": true,
            "afibCvrEnabled": false,
            "afibRvrEnabled": false,
            "afibRvrHeartRateLimit": 100,
            "vtachVfibEnabled": false,
            "asysEnabled": true
        };
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
                    this.loadCareUnits();

                    this.pageLoadingComplete = true;
                },
                (error: any) => {
                    if (error.status === this.NOT_FOUND_STATUS) {
                        this.initDefaultFacilityForm();

                        this.pageLoadingComplete = true;
                    } else {
                        if (error.status !== this.UNAUTHORIZED_STATUS) {
                            this.notificationService.showErrorNotification("Failed to load clinical-configuration configuration", "Error");
                        }
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

    arrhythmiaAlarmsEnabled(): boolean {
        return this.facilityForm.get("arrhythmiaAlarmsEnabled").value;
    }

    postureAlarmsEnabled(): boolean {
        return this.facilityForm.get("postureAlarmsEnabled").value;
    }

    kPa(): boolean {
        return this.facilityForm.get("bloodPressureUnitsOfMeasure").value === this.bloodPressureUnitOptions[1].name;
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
        this.facilityForm.addControl("id", this.formBuilder.control(this.facility.id));
        this.apiService
            .put('/facility-units', this.facilityForm.value)
            .subscribe(
                (response: Response) => {
                    this.reloadCareUnits();
                    this.facility = response.json();
                    this.notificationService.showSuccessNotification(this.facilityForm.get("name").value.concat(" has been updated successfully"), "Success");
                },
                (error: any) => {
                    this.notificationService.showErrorNotification("Failed to update clinical-configuration", "Error");
                });
    }

    private reloadCareUnits() {
        if (this.facilityForm.get("bloodPressureUnitsOfMeasure").value !== this.facility.bloodPressureUnitsOfMeasure) {
            this.loadCareUnits();
        }
    }

    private createFacility() {
        this.apiService
            .post('/facility-units', this.facilityForm.value)
            .subscribe(
                (response: Response) => {
                    this.facility = response.json();
                    this.notificationService.showSuccessNotification(this.facilityForm.get("name").value.concat(" has been successfully created"), "Success");
                },
                (error: any) => {
                    this.notificationService.showErrorNotification("Failed to create new clinical-configuration", "Error");
                });
    }

    private prepareBeforeSubmit() {
        this.facilityForm.get('temperatureDisplay').setValue(this.facilityForm.get('temperatureDisplay').value ? 'On' : 'Off');
        this.facilityForm.get('respirationDisplay').setValue(this.facilityForm.get('respirationDisplay').value ? 'On' : 'Off');
    }

    public locationDropOver(e:any):void {
        this.hasLocationDropOver = e;
    }

    public configurationDropOver(e:any):void {
        this.hasConfigurationDropOver = e;
    }

    public locationsCsvFileSelected(): boolean {
        return this.locationsUploader.queue.length > 0;
    }

    public configurationJsonSelected(): boolean {
        return this.configurationUploader.queue.length > 0;
    }

    private loadCareUnits() {
        this.apiService
            .get("/care-units")
            .subscribe(
                (response: Response) => {
                    this.careUnits = response.json();
                },
                (error: any) => {
                    this.notificationService.showErrorNotification("Failed to load care units", "Failure");
                }
            );
    }

    showCareUnitForm(): void {
        this.showCareUnitCreationForm = true;
    }

    hideCareUnitCreationForm(): void {
        this.showCareUnitCreationForm = false;
    }

    addToList(careUnit: any): void {
        this.careUnits.push(careUnit);
        this.hideCareUnitCreationForm();
    }

    updateList(careUnit: any): void {
        this.careUnits = this.careUnits.filter(item => item.id !== careUnit.id)
        this.careUnits.push(careUnit);
        this.hideCareUnitCreationForm();
    }

    removeFromList(id: string): void {
        this.careUnits = this.careUnits.filter(item => item.id !== id);
    }
}