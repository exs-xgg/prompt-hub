import mongoose, { Schema, Document, Model } from 'mongoose';

const authorSchema = new Schema(
  {
    name: { type: String, default: 'Anonymous' },
    avatar: { type: String, default: '' },
    role: { type: String, default: 'Member' },
  },
  { _id: false }
);

export interface IPrompt extends Document {
  title: string;
  category: string;
  platform: string;
  description: string;
  promptText: string;
  exampleOutput?: string;
  votes: number;
  author: { name: string; avatar: string; role: string };
  createdAt: Date;
  updatedAt: Date;
}

const promptSchema = new Schema<IPrompt>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    platform: { type: String, required: true },
    description: { type: String, required: true },
    promptText: { type: String, required: true },
    exampleOutput: { type: String, default: '' },
    votes: { type: Number, default: 0 },
    author: { type: authorSchema, default: () => ({ name: 'Anonymous', avatar: '', role: 'Member' }) },
  },
  { timestamps: true }
);

export const Prompt: Model<IPrompt> = mongoose.models.Prompt ?? mongoose.model<IPrompt>('Prompt', promptSchema);
