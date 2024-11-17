import mongoose from "mongoose";
import { CanvasModel } from "./canvas.model";

const Schema = mongoose.Schema;

const ExportsSchema = new Schema({
    canvasId: {
        type: Schema.Types.ObjectId,
        ref: "Canvas",
        required: true
    }
    
},{timestamps: true});

export const ExportsModel = mongoose.model("Exports", ExportsSchema);

