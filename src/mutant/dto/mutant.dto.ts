import {
  IsArray,
  IsString,
  ArrayMinSize,
  Matches,
  Validate,
} from 'class-validator';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsUniformLength', async: false })
class IsUniformLength implements ValidatorConstraintInterface {
  validate(dna: string[]) {
    if (!dna || dna.length === 0) return true;
    const length = dna[0].length;
    return dna.every((sequence) => sequence.length === length);
  }

  defaultMessage() {
    return 'All DNA sequences must have the same length';
  }
}

export class DnaDto {
  @IsArray()
  @ArrayMinSize(4)
  @Matches(/^[ATCG]+$/, {
    each: true,
    message: 'Invalid DNA sequence, only A, T, C, G are allowed',
  })
  @IsString({ each: true })
  @Validate(IsUniformLength, {
    message: 'All DNA sequences must have the same length',
  })
  dna: string[];
}
