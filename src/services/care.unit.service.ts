import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "./api.service";
import {NotificationService} from "./notification.service";
import {EventEmitter} from "@angular/core/core";
import {Response} from "@angular/http";

export class CareUnitService {
    OXYGEN_LABEL = "SpO2";
    OXYGEN_SATURATION_HIGH_THRESHOLD: number = 100;

    BOUNDARY_ERROR_PROPERTY_NAME = "boundaryError";
    CONDITION_ERROR_PROPERTY_NAME = "conditionError";

    options: Array<any> = [];

    careUnitForm: FormGroup;

    constructor(private apiService: ApiService, private notificationService: NotificationService) {
        this.options = [
            {name: 'On'},
            {name: 'Off'}
        ];
    }

    initCareUnitForm(formBuilder: FormBuilder, careUnit: any): FormGroup {
        this.careUnitForm = formBuilder.group({
            id: [careUnit.id],
            name: [careUnit.name, Validators.required],
            enabled: [careUnit.enabled],
            alarmLimits: formBuilder.array(this.buildAlarmFormControls(careUnit.alarmLimits, formBuilder)),
            afibCvrEnabled: [careUnit.afibCvrEnabled],
            afibRvrEnabled: [careUnit.afibRvrEnabled],
            afibRvrHeartRateLimit: [careUnit.afibRvrHeartRateLimit],
            vtachVfibEnabled: [careUnit.vtachVfibEnabled],
            asysEnabled: [careUnit.asysEnabled],
            fallDetection: [careUnit.fallDetection === this.options[0].name],
            inactivityAlarm: [careUnit.inactivityAlarm === this.options[0].name]
        });
        return this.careUnitForm;
    }

    public buildAlarmFormControls(alarmLimits: Array<any>, formBuilder: FormBuilder): any[] {
        let controls: Array<any> = [];
        alarmLimits.forEach(limit => {
            controls.push(formBuilder.group({
                label: [limit.label],
                low: [limit.low],
                high: [{value: limit.high, disabled: limit.label === this.OXYGEN_LABEL}],
                lowBoundary: [limit.lowBoundary],
                highBoundary: [{value: limit.highBoundary, disabled: limit.label === this.OXYGEN_LABEL}]
            }));
        });
        return controls;
    }

    public save(careUnit: any, emitter: EventEmitter<any>): void {
        this.apiService
            .post("/care-units", careUnit)
            .subscribe(
                (response: Response) => {
                    this.notificationService.showSuccessNotification(careUnit.name.concat(" has been created successfully"), "Create");
                    emitter.emit(response.json());
                },
                (error: any) => {
                    this.notificationService.showErrorNotification("Failed to update ".concat(careUnit.name), "Create");
                }
            );
    }

    public update(careUnit: any, emitter: EventEmitter<any>): void {
        this.apiService
            .put("/care-units", careUnit)
            .subscribe(
                (response: Response) => {
                    this.notificationService.showSuccessNotification(careUnit.name.concat(" has been updated successfully"), "Update");
                    emitter.emit(careUnit);
                },
                (error: any) => {
                    this.notificationService.showErrorNotification("Failed to update ".concat(careUnit.name), "Update");
                }
            );
    }

    public remove(id: string, name: string, emitter: EventEmitter<any>): void {
        this.apiService
            .delete(`/care-units/${id}`)
            .subscribe(
                (response: Response) => {
                    this.notificationService.showSuccessNotification(`${name} has been deleted`, "Delete")
                    emitter.emit(id);
                },
                (error: any) => {
                    this.notificationService.showErrorNotification(`Failed to delete ${name}`, "Delete");
                }
            );
    }

    public watchAlarmLimits(boundariesValidationFunction: Function): void {
        this.careUnitForm.get("alarmLimits").valueChanges.subscribe(
            (newArray: Array<any>) => this.validate(newArray, boundariesValidationFunction)
        );
    }

    private validate(alarms: Array<any>, boundariesValidationFunction: Function) {
        alarms.forEach(alarm => {
            boundariesValidationFunction(alarm);
            this.validateCondition(alarm);
        });

        if (!alarms.every(this.isValid.bind(this))) {
            this.toggleFormValidity({alarmsValidationFailed: true});
        } else {
            this.toggleFormValidity(null);
        }
    }

    private isValid(alarm: any) {
        return alarm[this.BOUNDARY_ERROR_PROPERTY_NAME] === undefined
            && alarm[this.CONDITION_ERROR_PROPERTY_NAME] === undefined;
    }

    private toggleFormValidity(validity: any) {
        this.careUnitForm.get("alarmLimits").setErrors(validity);
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

    public toggleNameValidity(): void {
        if (this.careUnitForm.value.nameUniquenessError) {
            this.careUnitForm.get("name").setErrors({nameUniquenessError: true});
        } else {
            this.careUnitForm.get("name").setErrors(null);
        }
    }
}