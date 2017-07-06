import {ToastOptions} from "ng2-toastr";

export class VsmGlobalTostOptions extends ToastOptions {
    constructor() {
        super();

        this.showCloseButton = true;
        this.animate = "fade";
    }
}