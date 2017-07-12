import {Component, Input, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators, FormControl, ValidationErrors} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {Response} from "@angular/http";
import {NotificationService} from "../../services/notification.service";

@Component({
    selector: "care-unit",
    styleUrls: ['care-unit.css'],
    template: `
        <form [formGroup]="careUnitForm" (ngSubmit)="update(careUnitForm.value)">
        
            <!--<div>Form value: {{ careUnitForm.value | json }}</div><br/>-->
            <div>Form status: {{ careUnitForm.status | json }}</div>
        
            <input type="text" class="form-control vsm-care-unit-name-input" formControlName="name"/>
            <div class="form-group">
                <div class="vsm-checkbox vsm-care-unit-enabled">
                    <input id="careUnitEnabled" type="checkbox" formControlName="enabled">
                    <label for="careUnitEnabled" class="vsm-label blue">&nbsp;Enabled</label>
                </div>            
            </div>
            
            <h4>Alarm Settings</h4>
            
            <div class="row">
                <div class="col-md-6">
                    <fieldset class="vsm-scheduler-border physical-alarms-section" formArrayName="alarmLimits">
                        <legend>Physiological Alarms</legend>
                
                        <div class="vsm-control-group">
                            <div class="vsm-patient-defaults-left vsm-control-label"></div>
                            <span class="vsm-control-label" style="width: 120px">Patient Defaults</span>
                            <div class="vsm-patient-defaults-right vsm-control-label"></div>
                        </div>

                        <div class="vsm-control-group">
                            <span class="vsm-control-label">Low</span>
                            <span class="vsm-control-label"></span>
                            <span class="vsm-control-label">High</span>
                        </div>
                            
                        <div *ngFor="let alarmLimit of careUnitForm.controls.alarmLimits.controls; let i = index">
                            <div [formGroupName]="i" class="vsm-alarms">
                                <input type="text" class="vsm-control-input form-control" formControlName="lowBoundary"/>
                                <input type="text" class="vsm-control-input form-control" formControlName="low"/>
                                <label class="vsm-control-label">{{alarmLimit.get('label').value}}</label>
                                <input type="text" class="vsm-control-input form-control" formControlName="high"/>
                                <input type="text" class="vsm-control-input form-control" formControlName="highBoundary"/>
                                
                                <span *ngIf="careUnitForm.get('alarmLimits').value[i].validationMessage !== undefined" class="error-message">
                                    {{careUnitForm.get('alarmLimits').value[i].validationMessage}}
                                </span>
                            </div>
                        </div>
                
                        <div class="vsm-control-group">
                            <div class="vsm-patient-boundary-left vsm-control-label"></div>
                            <span class="vsm-control-label" style="width: 150px; margin-top: 25px; margin-bottom: 10px;">Care Unit Boundaries</span>
                            <div class="vsm-patient-boundary-right vsm-control-label"></div>
                        </div>
                    </fieldset>
                </div>
                            
                <div class="col-md-4 col-md-offset-1">
                    <fieldset class="vsm-scheduler-border" *ngIf="ltaAlarmsEnabled">
                                <legend class="vsm-scheduler-border center-aligned">&nbsp;&nbsp;Arrhythmia Alarms&nbsp;&nbsp;</legend>

                                <div class="form-group vsm-margin-bottom-8">
                                    <div class="vsm-checkbox">
                                        <input id="afibCvrEnabled-{{item.id}}" type="checkbox" formControlName="afibCvrEnabled">
                                        <label for="afibCvrEnabled-{{item.id}}" class="blue">AFIB CVR</label>
                                    </div>
                                </div>
                                <div class="form-group vsm-margin-bottom-8">
                                    <div class="vsm-checkbox">
                                        <input id="afibRvrEnabled-{{item.id}}" type="checkbox" formControlName="afibRvrEnabled">
                                        <label for="afibRvrEnabled-{{item.id}}" class="blue">AFIB RVR</label>
                                    </div>
                                </div>
                                <div class="form-inline vsm-heart-rate-input">
                                    <div class="form-group">
                                        <label for="newHeartRateLimit-{{item.id}}">Limit:&nbsp;</label>
                                        <input id="newHeartRateLimit-{{item.id}}" type="number" class="form-control" min="0" max="255" formControlName="afibRvrHeartRateLimit">
                                        <span *ngIf="careUnitForm.get('afibRvrHeartRateLimit').value > 255" class="error-message">Value should be in range 0...255</span>
                                    </div>
                                </div>
                                <div class="form-group vsm-margin-bottom-8">
                                    <div class="vsm-checkbox">
                                        <input id="heartRateLimittachVfibEnabled-{{item.id}}" type="checkbox" formControlName="vtachVfibEnabled">
                                        <label for="heartRateLimittachVfibEnabled-{{item.id}}" class="blue">VTACH/VFIB</label>
                                    </div>
                                </div>
                                <div class="form-group vsm-margin-bottom-8">
                                    <div class="vsm-checkbox">
                                        <input id="asysEnabled-{{item.id}}" type="checkbox" [checked]="true" formControlName="asysEnabled">
                                        <label for="asysEnabled-{{item.id}}" class="blue">Asys</label>
                                    </div>
                                </div>
                            </fieldset>
                            
                    <fieldset class="vsm-scheduler-border" *ngIf="postureAlarmsEnabled">
                        <legend class="vsm-scheduler-border">&nbsp;&nbsp;Posture Alarms&nbsp;&nbsp;</legend>

                            <div class="form-group vsm-margin-bottom-8">
                                <div class="vsm-checkbox">
                                    <input id="fallDetection-{{item.id}}" type="checkbox" formControlName="fallDetection">
                                    <label for="fallDetection-{{item.id}}" class="blue">Fall detection</label>
                                </div>
                            </div>
                            <div class="form-group vsm-margin-bottom-8">
                                <div class="vsm-checkbox">
                                <input id="inactivity-{{item.id}}" type="checkbox" formControlName="inactivityAlarm">
                                <label for="inactivity-{{item.id}}" class="blue">Inactivity</label>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
            
            <div>
                <button type="submit" class="btn btn-primary" [disabled]="!careUnitForm.valid">Update</button>
                <button type="button" class="btn btn-primary float-right" [disabled]="!careUnitForm.valid">Duplicate</button>
                <button type="button" class="btn btn-primary float-right" [ngStyle]="{'margin-right': '5px'}" [disabled]="!careUnitForm.valid">Remove</button>
            </div>
            
        </form>
    `
})
export class CareUnitComponent implements OnInit {
    @Input() item: any;
    @Input() unitOfMeasure: string;
    @Input() postureAlarmsEnabled: boolean;
    @Input() ltaAlarmsEnabled: boolean;

    HR_PR_LOW_THRESHOLD: number = 30;
    HR_PR_HIGH_THRESHOLD: number = 240;
    SYSTOLIC_LOW_THRESHOLD: number = 60;
    SYSTOLIC_HIGH_THRESHOLD: number = 240;
    DIASTOLIC_LOW_THRESHOLD: number = 40;
    DIASTOLIC_HIGH_THRESHOLD: number = 160;
    MAP_LOW_THRESHOLD: number = 50;
    MAP_HIGH_THRESHOLD: number = 185;
    RESPIRATION_LOW_THRESHOLD: number = 3;
    RESPIRATION_HIGH_THRESHOLD: number = 50;
    OXYGEN_SATURATION_LOW_THRESHOLD: number = 70;
    OXYGEN_SATURATION_HIGH_THRESHOLD: number = 100;

    HR_PR_LABEL = 'HR/PR (BPM)';
    SYSTOLIC_LABEL = 'Systolic BP';
    DIASTOLIC_LABEL = 'Diastolic BP';
    MAP_LABEL = 'MAP';
    RESPIRATION_LABEL = 'Respiration';
    OXYGEN_LABEL = 'SpO2';

    careUnitForm: FormGroup;

    options: Array<any> = [];

    constructor(private formBuilder: FormBuilder, private apiService: ApiService, private notificationService: NotificationService) {
        this.options = [
            {name: 'On'},
            {name: 'Off'}
        ];
    }

    ngOnInit():void {
        this.careUnitForm = this.formBuilder.group({
            id: [this.item.id],
            name: [this.item.name, Validators.required],
            enabled: [this.item.enabled],
            alarmLimits: this.formBuilder.array(this.buildAlarmFormControls()),
            afibCvrEnabled: [this.item.afibCvrEnabled],
            afibRvrEnabled: [this.item.afibRvrEnabled],
            afibRvrHeartRateLimit: [this.item.afibRvrHeartRateLimit],
            vtachVfibEnabled: [this.item.vtachVfibEnabled],
            asysEnabled: [this.item.asysEnabled],
            fallDetection: [this.item.fallDetection === this.options[0].name],
            inactivityAlarm: [this.item.inactivityAlarm === this.options[0].name]
        });

        this.watchAlarmLimits();
    }

    private buildAlarmFormControls(): any[] {
        let controls: Array<any> = [];
        this.item.alarmLimits.forEach(limit => {
            controls.push(this.formBuilder.group({
                label: [limit.label],
                low: [limit.low],
                high: [{value: limit.high, disabled: limit.label === this.OXYGEN_LABEL}],
                lowBoundary: [limit.lowBoundary],
                highBoundary: [{value: limit.highBoundary, disabled: limit.label === this.OXYGEN_LABEL}]
            }));
        });
        return controls;
    }

    update(careUnit: any) {
        this.prepareFormBeforeUpdate(careUnit);
        this.apiService
            .put("/care-units", careUnit)
            .subscribe(
                (response: Response) => {
                    this.notificationService.showSuccessNotification(careUnit.name.concat(" has been updated successfully"), "Update");
                },
                (error: any) => {
                    this.notificationService.showErrorNotification("Failed to update ".concat(careUnit.name), "Update");
                }
            );
    }

    private prepareFormBeforeUpdate(careUnit: any) {
        careUnit.fallDetection = careUnit.fallDetection ? this.options[0].name: this.options[1].name
        careUnit.inactivityAlarm = careUnit.inactivityAlarm ? this.options[0].name: this.options[1].name
    }

    private watchAlarmLimits(): void {
        this.careUnitForm.get("alarmLimits").valueChanges.subscribe(
            (newArray: Array<any>) => this.validate(newArray)
        );
    }

    private validate(alarms: Array<any>) {
        alarms.forEach(alarm => this.checkValidity(alarm));

        if (!alarms.every(this.isValid.bind(this))) {
            this.setAlarmsValidity({alarmsValidationFailed: true})
        } else {
            this.setAlarmsValidity(null);
        }
    }

    private checkValidity(alarm: any): boolean {
        let valid = this.validateBoundaries(alarm) && this.validateCondition(alarm);

        if (!valid) {
            this.setError(alarm);
        } else {
            this.clearError(alarm)
        }
        return valid;
    }

    isValid(alarm: any) {
        return alarm.validationMessage === undefined;
    }

    private setAlarmsValidity(validity: any) {
        this.careUnitForm.get("alarmLimits").setErrors(validity);
    }

    private setError(alarm: any):void {
        let message: string = "Range ";
        if (alarm.label === this.HR_PR_LABEL) {
            message = message.concat("30...240");
        } else if (alarm.label === this.SYSTOLIC_LABEL) {
            message = message.concat("60...240");
        } else if (alarm.label === this.DIASTOLIC_LABEL) {
            message = message.concat("40...160");
        } else if (alarm.label === this.MAP_LABEL) {
            message = message.concat("50...185");
        } else if (alarm.label === this.RESPIRATION_LABEL) {
            message = message.concat("3...50");
        } else if (alarm.label === this.OXYGEN_LABEL) {
            message = message.concat("70...99");
        }
        message = message.concat(" and condition low_boundary <= low < high <= high_boundary mismatch");

        alarm['validationMessage'] = message;
    }

    private clearError(alarm: any) {
        alarm['validationMessage'] = undefined;
    }

    private validateBoundaries(alarm: any): boolean {
        let lowBoundary: number = new Number(alarm.lowBoundary).valueOf();
        let highBoundary: number = new Number(alarm.highBoundary).valueOf();
        let label: string = alarm.label;
        let boundariesValid: boolean = false;

        if (!isNaN(lowBoundary) && !isNaN(highBoundary)) {
            if (label === this.HR_PR_LABEL) {
                boundariesValid = lowBoundary >= this.HR_PR_LOW_THRESHOLD && highBoundary <= this.HR_PR_HIGH_THRESHOLD;
            } else if (label === this.SYSTOLIC_LABEL) {
                boundariesValid = lowBoundary >= this.SYSTOLIC_LOW_THRESHOLD && highBoundary <= this.SYSTOLIC_HIGH_THRESHOLD;
            } else if (label === this.DIASTOLIC_LABEL) {
                boundariesValid = lowBoundary >= this.DIASTOLIC_LOW_THRESHOLD && highBoundary <= this.DIASTOLIC_HIGH_THRESHOLD;
            } else if (label === this.MAP_LABEL) {
                boundariesValid = lowBoundary >= this.MAP_LOW_THRESHOLD && highBoundary <= this.MAP_HIGH_THRESHOLD;
            } else if (label === this.RESPIRATION_LABEL) {
                boundariesValid = lowBoundary >= this.RESPIRATION_LOW_THRESHOLD && highBoundary <= this.RESPIRATION_HIGH_THRESHOLD;
            }
        }

        if (label === this.OXYGEN_LABEL) {
            boundariesValid = lowBoundary >= this.OXYGEN_SATURATION_LOW_THRESHOLD && lowBoundary <   this.OXYGEN_SATURATION_HIGH_THRESHOLD;
        }

        return boundariesValid;
    }

    private validateCondition(alarm: any) {
        let lowBoundary: number = new Number(alarm.lowBoundary).valueOf();
        let low: number = new Number(alarm.low).valueOf();
        let high: number = new Number(alarm.high).valueOf();
        let highBoundary: number = new Number(alarm.highBoundary).valueOf();

        let conditionValid: boolean = false;

        if (!isNaN(low) && !isNaN(high) && low >= lowBoundary && high > low && high <= highBoundary) {
            conditionValid = true;
        } else if (isNaN(low) && !isNaN(high) && high >= lowBoundary && high <= highBoundary) {
            conditionValid = true;
        } else if (!isNaN(low) && isNaN(high) && low >= lowBoundary && low <= highBoundary) {
            conditionValid = true;
        } else if (isNaN(low) && isNaN(high) && lowBoundary <= highBoundary) {
            conditionValid = true;
        } else if (alarm.label === this.OXYGEN_LABEL) {
            conditionValid = low >= lowBoundary;
        }

        return conditionValid;
    }
}