import {Component, Input, OnInit, EventEmitter, Output} from "@angular/core";
import {FormGroup, FormBuilder} from "@angular/forms";
import {CareUnitService} from "../../services/care.unit.service";

@Component({
    selector: "mmhg-care-unit",
    styleUrls: ['care-unit.css'],
    templateUrl: "care-unit-template.html"
})
export class MmHgCareUnitComponent implements OnInit {
    @Input() item: any;
    @Input() isNew: boolean;
    @Input() postureAlarmsEnabled: boolean;
    @Input() ltaAlarmsEnabled: boolean;

    @Output() cancelEmitter: EventEmitter<any>;
    @Output() onCreateEmitter: EventEmitter<any>;
    @Output() onUpdateEmitter: EventEmitter<any>;
    @Output() onDeleteEmitter: EventEmitter<any>;
    @Output() onDuplicateEmitter: EventEmitter<any>;

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

    HR_PR_LABEL = "HR/PR (BPM)";
    SYSTOLIC_LABEL = "Systolic BP";
    DIASTOLIC_LABEL = "Diastolic BP";
    MAP_LABEL = "MAP";
    RESPIRATION_LABEL = "Respiration";
    OXYGEN_LABEL = "SpO2";

    BOUNDARY_ERROR_PROPERTY_NAME = "boundaryError";

    careUnitForm: FormGroup;

    options: Array<any> = [];

    constructor(private formBuilder: FormBuilder, private careUnitService: CareUnitService) {
        this.options = [
            {name: 'On'},
            {name: 'Off'}
        ];

        this.cancelEmitter = new EventEmitter();
        this.onCreateEmitter = new EventEmitter();
        this.onUpdateEmitter = new EventEmitter();
        this.onDeleteEmitter = new EventEmitter();
        this.onDuplicateEmitter = new EventEmitter();
    }

    ngOnInit():void {
        this.careUnitForm = this.careUnitService.initCareUnitForm(this.formBuilder, this.item);
        this.careUnitService.watchAlarmLimits(this.validateBoundaries.bind(this));
    }

    saveOrUpdate(careUnit: any) {
        this.prepareFormBeforeUpdate(careUnit);

        if (this.isNew) {
            this.save(careUnit);
        } else {
            this.update(careUnit);
        }


    }

    private save(careUnit: any): void {
        this.careUnitService.save(careUnit, this.onCreateEmitter);
    }

    private update(careUnit: any): void {
        this.careUnitService.update(careUnit, this.onUpdateEmitter);
    }

    private prepareFormBeforeUpdate(careUnit: any) {
        careUnit.fallDetection = careUnit.fallDetection ? this.options[0].name: this.options[1].name;
        careUnit.inactivityAlarm = careUnit.inactivityAlarm ? this.options[0].name: this.options[1].name;
    }

    private validateBoundaries(alarm: any) {
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
        } else if (!isNaN(lowBoundary) && isNaN(highBoundary)) {
            if (label === this.HR_PR_LABEL) {
                boundariesValid = lowBoundary >= this.HR_PR_LOW_THRESHOLD;
            } else if (label === this.SYSTOLIC_LABEL) {
                boundariesValid = lowBoundary >= this.SYSTOLIC_LOW_THRESHOLD;
            } else if (label === this.DIASTOLIC_LABEL) {
                boundariesValid = lowBoundary >= this.DIASTOLIC_LOW_THRESHOLD;
            } else if (label === this.MAP_LABEL) {
                boundariesValid = lowBoundary >= this.MAP_LOW_THRESHOLD;
            } else if (label === this.RESPIRATION_LABEL) {
                boundariesValid = lowBoundary >= this.RESPIRATION_LOW_THRESHOLD;
            }
        }

        if (label === this.OXYGEN_LABEL) {
            boundariesValid = lowBoundary >= this.OXYGEN_SATURATION_LOW_THRESHOLD && lowBoundary < this.OXYGEN_SATURATION_HIGH_THRESHOLD;
        }

        if (!boundariesValid) {
            this.setBoundaryError(alarm);
        } else {
            this.clearBoundaryError(alarm);
        }
    }

    private setBoundaryError(alarm: any):void {
        let message: string = "Value should be in range ";
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

        alarm[this.BOUNDARY_ERROR_PROPERTY_NAME] = message;
    }

    private clearBoundaryError(alarm: any) {
        alarm[this.BOUNDARY_ERROR_PROPERTY_NAME] = undefined;
    }

    cancel(): void {
        this.cancelEmitter.emit();
    }

    remove(): void {
        this.careUnitService.remove(this.item.id, this.item.name, this.onDeleteEmitter);
    }

    duplicate(): void {
        this.onDuplicateEmitter.emit(this.careUnitForm.value);
    }
}