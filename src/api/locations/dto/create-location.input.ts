import { Field, InputType, Int, Float } from '@nestjs/graphql';


@InputType()
export class CreateLocationInput {
    // GraphQL does not endorse mixing object types (returning type)
    // with input types (type for mutations)
    // so the definitions are duplicated
    // https://github.com/MichalLytek/type-graphql/issues/76

    @Field(() => Int, { description: 'Venue id, used by LCSD' })
    id: number;

    @Field(() => String, {description: "Chinese name of the venue"})
    chi_name: string;

    @Field(() => String, {description: "English name of the venue"})
    en_name: string;

    @Field(() => Float, {description: "Latitude of the venue", nullable: true})
    latitude?: number;

    @Field(() => Float, {description: "Longitude of the venue", nullable: true})
    longitude?: number;
}
