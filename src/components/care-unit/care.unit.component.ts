import {Component, Input, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";

@Component({
    selector: "care-unit",
    template: `
        <form [formGroup]="careUnitForm">
            <input type="text" class="form-control" formControlName="name"/>
            
            <h4>Alarm Settings</h4>
            
            <fieldset class="vsm-scheduler-border" formArrayName="alarmLimits">
                <legend>Physiological Alarms</legend>
                            
                <div *ngFor="let alarmLimit of careUnitForm.controls.alarmLimits.controls; let i = index">
                    <div [formGroupName]="i" class="vsm-alarms">
                            <input type="text" class="vsm-control-input form-control" formControlName="lowBoundary"/>
                            <input type="text" class="vsm-control-input form-control" formControlName="low"/>
                            <label class="vsm-control-label">{{alarmLimit.get('label').value}}</label>
                            <input type="text" class="vsm-control-input form-control" formControlName="highBoundary"/>
                            <input type="text" class="vsm-control-input form-control" formControlName="high"/>
                    </div>
                </div>
            </fieldset>
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
            alarmLimits: this.formBuilder.array(this.buildAlarmFormControls())
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
}