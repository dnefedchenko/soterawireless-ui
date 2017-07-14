import {Component, OnInit, Input} from "@angular/core";

@Component({
    selector: "care-unit-list",
    template: `
        <ngb-accordion #acc="ngbAccordion">
        <ngb-panel *ngFor="let careUnit of careUnits" title="{{careUnit.name}}">
            <ng-template ngbPanelContent>
                <kpa-care-unit *ngIf="isKPa" [item]="careUnit" [isNew]="false"
                    [postureAlarmsEnabled]="postureAlarmsEnabled()"
                    [ltaAlarmsEnabled]="arrhythmiaAlarmsEnabled()"
                    (onUpdateEmitter)="updateList($event)"
                    (onDeleteEmitter)="removeFromList($event)"
                    (onDuplicateEmitter)="copyCareUnit($event)">
                </kpa-care-unit>

                <mmhg-care-unit *ngIf="!isKPa" [item]="careUnit" [isNew]="false"
                    [postureAlarmsEnabled]="postureAlarmsEnabled()"
                    [ltaAlarmsEnabled]="arrhythmiaAlarmsEnabled()"
                    (onUpdateEmitter)="updateList($event)"
                    (onDeleteEmitter)="removeFromList($event)"
                    (onDuplicateEmitter)="copyCareUnit($event)">
                </mmhg-care-unit>
            </ng-template>
        </ngb-panel>
    </ngb-accordion>
    `
})
export class CareUnitListComponent implements OnInit {
    @Input() careUnits: Array<any>;
    @Input() isKPa: boolean;

    ngOnInit(): void {
    }

}