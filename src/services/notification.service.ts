import {Injectable} from "@angular/core";
import {ToastsManager} from "ng2-toastr";

@Injectable()
export class NotificationService {
    constructor(private toastsManager: ToastsManager) {

    }

    public showSuccessNotification(message: string, title: string) {
        this.toastsManager.success(message, title);
    }

    public showErrorNotification(message: string, title: string) {
        this.toastsManager.error(message, title);
    }

    public showInfoNotification(message: string, title: string) {
        this.toastsManager.info(message, title);
    }
}