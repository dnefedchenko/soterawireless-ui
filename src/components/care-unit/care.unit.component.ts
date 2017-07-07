import {Component, Input} from "@angular/core";

@Component({
    selector: "care-unit",
    template:
        `
            <input id="careUnitName" type="text" class="form-control" placeholder="Enter name">
        `
})
export class CareUnitComponent {
    @Input() item: any;
}