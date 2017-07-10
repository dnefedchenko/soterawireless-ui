import {Component, Input, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";

@Component({
    selector: "care-unit",
    styleUrls: ['care-unit.css'],
    template: `
        <form [formGroup]="careUnitForm">
            <input type="text" class="form-control vsm-care-unit-name-input" formControlName="name"/>
            <div class="form-group">
                <div class="vsm-checkbox vsm-care-unit-enabled">
                    <input id="careUnitEnabled" type="checkbox" formControlName="enabled">
                    <label for="careUnitEnabled" class="vsm-label blue">&nbsp;Enabled</label>
                </div>            
            </div>
            
            <h4>Alarm Settings</h4>
            
            <div class="row">
                <div class="col-md-5">
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
                                <input type="text" class="vsm-control-input form-control" formControlName="highBoundary"/>
                                <input type="text" class="vsm-control-input form-control" formControlName="high"/>
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
                    <fieldset class="vsm-scheduler-border" *ngIf="ltaAlarmsEnabled()">
                                <legend class="vsm-scheduler-border center-aligned">&nbsp;&nbsp;Arrhythmia Alarms&nbsp;&nbsp;</legend>

                                <div class="form-group vsm-margin-bottom-8">
                                    <div class="vsm-checkbox">
                                        <input id="afibCvrEnabled" type="checkbox" formControlName="afibCvrEnabled">
                                        <label for="afibCvrEnabled" class="blue">AFIB CVR</label>
                                    </div>
                                </div>
                                <div class="form-group vsm-margin-bottom-8">
                                    <div class="vsm-checkbox">
                                        <input id="afibRvrEnabled" type="checkbox" formControlName="afibRvrEnabled">
                                        <label for="afibRvrEnabled" class="blue">AFIB RVR</label>
                                    </div>
                                </div>
                                <div class="form-inline vsm-heart-rate-input">
                                    <div class="form-group">
                                        <label for="newHeartRateLimit">Limit:&nbsp;</label>
                                        <input id="newHeartRateLimit" type="number" class="form-control" min="0" max="255" formControlName="afibRvrHeartRateLimit">
                                        <span *ngIf="careUnitForm.get('afibRvrHeartRateLimit').value > 255" class="error-message">Value should be in range 0...255</span>
                                    </div>
                                </div>
                                <div class="form-group vsm-margin-bottom-8">
                                    <div class="vsm-checkbox">
                                        <input id="heartRateLimittachVfibEnabled" type="checkbox" formControlName="vtachVfibEnabled">
                                        <label for="heartRateLimittachVfibEnabled" class="blue">VTACH/VFIB</label>
                                    </div>
                                </div>
                                <div class="form-group vsm-margin-bottom-8">
                                    <div class="vsm-checkbox">
                                        <input id="asysEnabled" type="checkbox" [checked]="true" formControlName="asysEnabled">
                                        <label for="asysEnabled" class="blue">Asys</label>
                                    </div>
                                </div>
                            </fieldset>
                            
                    <fieldset class="vsm-scheduler-border" *ngIf="postureAlarmsEnabled()">
                        <legend class="vsm-scheduler-border">&nbsp;&nbsp;Posture Alarms&nbsp;&nbsp;</legend>

                            <div class="form-group vsm-margin-bottom-8">
                                <div class="vsm-checkbox">
                                    <input id="fallDedection" type="checkbox" formControlName="fallDetection">
                                    <label for="fallDedection" class="blue">Fall detection</label>
                                </div>
                            </div>
                            <div class="form-group vsm-margin-bottom-8">
                                <div class="vsm-checkbox">
                                <input id="inactivity" type="checkbox" formControlName="inactivityAlarm">
                                <label for="inactivity" class="blue">Inactivity</label>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
            
            <div>
                <button type="submit" class="btn btn-primary" [disabled]="!careUnitForm.valid">Save</button>
                <button type="button" class="btn btn-primary float-right" [disabled]="!careUnitForm.valid">Duplicate</button>
                <button type="button" class="btn btn-primary float-right" [ngStyle]="{'margin-right': '5px'}" [disabled]="!careUnitForm.valid">Remove</button>
            </div>
            
        </form>
    `
})
export class CareUnitComponent implements OnInit {
    @Input() item: any;

    careUnitForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private apiService: ApiService) {}

    ngOnInit():void {
        this.careUnitForm = this.formBuilder.group({
            name: [this.item.name, Validators.required],
            enabled: [this.item.enabled],
            alarmLimits: this.formBuilder.array(this.buildAlarmFormControls()),
            afibCvrEnabled: [this.item.afibCvrEnabled],
            afibRvrEnabled: [this.item.afibRvrEnabled],
            afibRvrHeartRateLimit: [this.item.afibRvrHeartRateLimit],
            vtachVfibEnabled: [this.item.vtachVfibEnabled],
            asysEnabled: [{value: this.item.asysEnabled, disabled: true}],
            fallDetection: [this.item.fallDetection],
            inactivityAlarm: [this.item.inactivityAlarm]
        });
    }

    private buildAlarmFormControls(): any[] {
        let controls: Array<any> = [];
        this.item.alarmLimits.forEach(limit => {
            controls.push(this.formBuilder.group({
                label: [limit.label, Validators.required],
                low: [limit.low],
                high: [limit.high],
                lowBoundary: [limit.lowBoundary],
                highBoundary: [limit.highBoundary]
            }));
        });
        return controls;
    }

    ltaAlarmsEnabled(): boolean {
        return true;
    }

    postureAlarmsEnabled(): boolean {
        return true;
    }
}