import { Document, model, Schema } from 'mongoose'

export interface IUser extends Document {
  _id: string
  username: string
  email: string
  password: string
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const User = model<IUser>('User', userSchema)
