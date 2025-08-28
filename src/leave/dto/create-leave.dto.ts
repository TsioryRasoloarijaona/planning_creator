import { IsDate, IsString, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Allow } from 'class-validator';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'isStartDateBeforeEndDate', async: false })
class IsStartDateBeforeEndDateConstraint implements ValidatorConstraintInterface {
    validate(_: any, args: ValidationArguments) {
        const obj = args.object as any;
        return obj.StartDate && obj.EndDate && obj.StartDate < obj.EndDate;
    }

    defaultMessage(args: ValidationArguments) {
        return 'StartDate must be before EndDate';
    }
}

export class CreateLeaveDto {
    @Allow()
    accountId?: number;

    @Type(() => Date)
    @IsDate()
    @Allow()
    StartDate: Date;

    @Type(() => Date)
    @IsDate()
    @Allow()
    EndDate: Date;

    @IsString()
    @Allow()
    Reason: string;

    @Validate(IsStartDateBeforeEndDateConstraint)
    validateDates: boolean;
}
