import { FormControl, ValidationErrors } from "@angular/forms";

export class FormValidators {

    // whitespace validation

    static notOnlyWhitespace(control : FormControl) : ValidationErrors {

        // check if string oly contains only whitespace

        if((control.value != null) && (control.value.trim().length === 0)) {
            // As a standard use error key same asmethod name
            return { 'notOnlyWhitespace' : true };
        }

        return null;
    }
}
