import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVote extends Document {
  promptId: mongoose.Types.ObjectId;
  voterId: string;
  direction: 1 | -1; // 1 = up, -1 = down
}

const voteSchema = new Schema<IVote>(
  {
    promptId: { type: Schema.Types.ObjectId, ref: 'Prompt', required: true },
    voterId: { type: String, required: true },
    direction: { type: Number, required: true, enum: [1, -1] },
  },
  { timestamps: true }
);

voteSchema.index({ promptId: 1, voterId: 1 }, { unique: true });

export const Vote: Model<IVote> = mongoose.models.Vote ?? mongoose.model<IVote>('Vote', voteSchema);
