import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {NotificationService} from "../../services/notification.service";
import {CareUnitService} from "../../services/care.unit.service";

@Component({
    selector: "kpa-care-unit",
    styleUrls: ['care-unit.css'],
    templateUrl: "care-unit-template.html"
})
export class KpaCareUnitComponent implements OnInit {
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
    SYSTOLIC_LOW_THRESHOLD = 8.0;
    SYSTOLIC_HIGH_THRESHOLD = 31.9;
    DIASTOLIC_LOW_THRESHOLD = 5.4;
    DIASTOLIC_HIGH_THRESHOLD = 21.3;
    MAP_LOW_THRESHOLD = 6.7;
    MAP_HIGH_THRESHOLD = 24.6;
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
    CONDITION_ERROR_PROPERTY_NAME = "conditionError";

    careUnitForm: FormGroup;

    options: Array<any> = [];

    constructor(private formBuilder: FormBuilder, private careUnitService: CareUnitService,
                private apiService: ApiService, private notificationService: NotificationService) {
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

    ngOnInit(): void {
        this.careUnitForm = this.formBuilder.group({
            id: [this.item.id],
            name: [this.item.name, Validators.required],
            enabled: [this.item.enabled],
            alarmLimits: this.formBuilder.array(this.careUnitService.buildAlarmFormControls(this.item.alarmLimits, this.formBuilder)),
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
        careUnit.fallDetection = careUnit.fallDetection ? this.options[0].name : this.options[1].name;
        careUnit.inactivityAlarm = careUnit.inactivityAlarm ? this.options[0].name : this.options[1].name;
    }

    private watchAlarmLimits(): void {
        this.careUnitForm.get("alarmLimits").valueChanges.subscribe(
            (newArray: Array<any>) => this.validate(newArray)
        );
    }

    private validate(alarms: Array<any>) {
        alarms.forEach(alarm => {
            this.validateBoundaries(alarm);
            this.validateCondition(alarm);
        });

        if (!alarms.every(this.isValid.bind(this))) {
            this.toggleFormValidity({alarmsValidationFailed: true})
        } else {
            this.toggleFormValidity(null);
        }
    }

    private toggleFormValidity(validity: any) {
        this.careUnitForm.get("alarmLimits").setErrors(validity);
    }

    isValid(alarm: any) {
        return alarm[this.BOUNDARY_ERROR_PROPERTY_NAME] === undefined
            && alarm[this.CONDITION_ERROR_PROPERTY_NAME] === undefined;
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

    private setBoundaryError(alarm: any): void {
        let message: string = "Value should be in range ";
        if (alarm.label === this.HR_PR_LABEL) {
            message = message.concat("30...240");
        } else if (alarm.label === this.SYSTOLIC_LABEL) {
            message = message.concat("8.0...39.1");
        } else if (alarm.label === this.DIASTOLIC_LABEL) {
            message = message.concat("5.4...21.3");
        } else if (alarm.label === this.MAP_LABEL) {
            message = message.concat("6.7...24.6");
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

    private validateCondition(alarm: any) {
        let lowBoundary: number = new Number(alarm.lowBoundary).valueOf();
        let low: number = new Number(alarm.low).valueOf();
        let high: number = new Number(alarm.high).valueOf();
        let highBoundary: number = new Number(alarm.highBoundary).valueOf();

        let conditionValid: boolean = false;

        if (!isNaN(low) && !isNaN(high) && low >= lowBoundary && high > low && high <= highBoundary) {
            conditionValid = true;
        } else if (!isNaN(low) && !isNaN(high) && isNaN(highBoundary) && low >= lowBoundary && high > low) {
            conditionValid = true;
        } else if (isNaN(low) && !isNaN(high) && high >= lowBoundary && high <= highBoundary) {
            conditionValid = true;
        } else if (!isNaN(low) && isNaN(high) && low >= lowBoundary && low <= highBoundary) {
            conditionValid = true;
        } else if (isNaN(low) && isNaN(high) && lowBoundary <= highBoundary) {
            conditionValid = true;
        } else if (alarm.label === this.OXYGEN_LABEL) {
            conditionValid = low >= lowBoundary && low <= this.OXYGEN_SATURATION_HIGH_THRESHOLD;
        }

        if (!conditionValid) {
            this.setConditionError(alarm);
        } else {
            this.clearConditionError(alarm);
        }
    }

    private setConditionError(alarm: any): void {
        alarm[this.CONDITION_ERROR_PROPERTY_NAME] = "Value should satisfy condition low_boundary <= low < high <= high_boundary";
    }

    private clearConditionError(alarm: any): void {
        alarm[this.CONDITION_ERROR_PROPERTY_NAME] = undefined;
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