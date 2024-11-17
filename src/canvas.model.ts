import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface ICanvas {
  width: number;
  height: number;
  elements: [{}];
}
const CanvasSchema = new Schema<ICanvas>({
  elements: {
    default: [],
    type: [{}],
  },
  width: Number,
  height: Number,
});

export const CanvasModel = mongoose.model("Canvas", CanvasSchema);
