import { Field, InputType, Int, OmitType, PartialType } from '@nestjs/graphql';
import { CreateLocationInput } from './create-location.input';

@InputType()
export class UpdateLocationInput extends PartialType(OmitType(CreateLocationInput, ['id'] as const)) {}
