import { Schema, model, Document } from "mongoose"

interface IGoogleUser extends Document {
    googleId: string
    email: string
    username: string
    displayName: string
    createdAt: Date
    updatedAt: Date
}

const GoogleUserSchema = new Schema<IGoogleUser>({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    displayName: {
        type: String,
        required: true
    }
}, { timestamps: true })

export default model<IGoogleUser>("GoogleUser", GoogleUserSchema)