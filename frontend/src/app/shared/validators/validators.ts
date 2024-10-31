import { ValidationErrors, AbstractControl, } from '@angular/forms';

export const isFieldOneEqualsFieldTwo = (field_1: string, field_2: string) => {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const field_1_value: string = formGroup.get(field_1)?.value;
        const field_2_value: string = formGroup.get(field_2)?.value;
        if (field_1_value !== field_2_value) {
            formGroup.get(field_2)?.setErrors({ notEqual: true });
            return { notEqual: true };
        }
        formGroup.get(field_2)?.setErrors(null);
        return null;
    }
}