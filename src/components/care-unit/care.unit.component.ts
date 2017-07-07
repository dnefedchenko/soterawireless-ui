import {Component, Input, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";

@Component({
    selector: "care-unit",
    template: `
        <form [formGroup]="careUnitForm">
            <input id="careUnitName" type="text" class="form-control" formControlName="name">
            
            <div formArrayName="alarmLimits">
                <div *ngFor="let alarmLimit of careUnitForm.controls.alarmLimits.controls; let i = index">
                    <div [formGroupName]="i">
                        <div>
                            <input type="text" class="form-control" formControlName="name">                        
                        </div>                    
                    </div>
                </div>
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
            alarmLimits: this.formBuilder.array(this.buildAlarmFormControls())
        });
    }

    private buildAlarmFormControls(): any[] {
        let controls: Array<any> = [];
        this.item.alarmLimits.forEach(limit => {
            controls.push(this.formBuilder.group({
                name: [limit.label, Validators.required],
                low: [limit.low],
                high: [limit.high],
                lowBoundary: [limit.lowBoundary],
                highBoundary: [limit.highBoundary]
            }));
        });
        return controls;
    }
}