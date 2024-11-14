import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DNA extends Document {
  @Prop({ required: true, unique: true })
  sequence: string;

  @Prop({ required: true })
  isMutant: boolean;
}

export const DNASchema = SchemaFactory.createForClass(DNA);
