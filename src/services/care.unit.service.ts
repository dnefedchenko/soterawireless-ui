import {FormBuilder} from "@angular/forms";
import {ApiService} from "./api.service";
import {NotificationService} from "./notification.service";
import {EventEmitter} from "@angular/core/core";
import {Response} from "@angular/http";

export class CareUnitService {
    OXYGEN_LABEL = "SpO2";

    constructor(private apiService: ApiService, private notificationService: NotificationService) {

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
}