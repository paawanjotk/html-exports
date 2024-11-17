import { config } from "dotenv";
config();

import express from "express";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { CanvasModel } from "./canvas.model";
import { processRequestBody } from "zod-express-middleware";
import { z } from "zod";
import { elementsSchema } from "./elementSchema";
import { CanvasRenderingContext2D, createCanvas } from "canvas";
import { ExportsModel } from "./exports.model";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
mongoose
  .connect(process.env.MONGODB_URL as string)
  .then(() => console.log("Connected!"));

app.get("/", function (req: Request, res: Response) {
  res.send("Healthy as a horse");
});

app.post("/canvas", function (req: Request, res: Response) {
  try {
    const { width, height } = req.body;
    const canvas = new CanvasModel({ width, height });
    canvas.save().then(() => res.status(201).send({ canvasId: canvas._id }));
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post(
  "/canvas/elements",
  processRequestBody(
    z.object({ canvasId: z.string(), elements: z.array(elementsSchema).min(1) })
  ),
  function (req: Request, res: Response) {
    try {
      const { canvasId, elements } = req.body;

      CanvasModel.findByIdAndUpdate(
        canvasId,
        {
          $push: { elements: { $each: elements } },
        },
        { new: true, upsert: false }
      ).then((updatedCanvas) => {
        if (!updatedCanvas) {
          return res.status(404).send("Canvas not found");
        }
        res.status(201).send("Canvas updated successfully");
      });
    } catch (error) {
      res.sendStatus(500);
    }
  }
);

const PROPERTIES = ["fillStyle", "strokeStyle", "font"];

app.post(
  "/canvas/export",
  processRequestBody(z.object({ canvasId: z.string() })),
  async function (req: Request, res: Response) {
    try {
      const { canvasId } = req.body;

      if (!canvasId) {
        res.status(400).send("Missing canvasId");
        return;
      }

      const canvasDoc = await CanvasModel.findById(canvasId);
      if (!canvasDoc) {
        res.status(404).send("Canvas not found");
        return;
      }

      const canvas = createCanvas(canvasDoc.width, canvasDoc.height, "svg");
      const ctx = canvas.getContext("2d");

      for (const element of canvasDoc.elements as unknown as z.infer<
        typeof elementsSchema
      >[]) {
        ctx.strokeStyle = "black";

        for (const key of PROPERTIES) {
          const k = key as keyof CanvasRenderingContext2D;
          if (k in element) {
            //@ts-ignore
            ctx[k] = element[k];
          }
        }

        switch (element.type) {
          case "text": {
            ctx.font = "20px Arial";
            ctx.fillText(element.text, element.x, element.y);
            break;
          }
          case "rectangle": {
            if (element.fillStyle) {
              ctx.fillRect(element.x, element.y, element.width, element.height);
              break;
            }
            ctx.strokeRect(element.x, element.y, element.width, element.height);
            break;
          }
          case "circle": {
            ctx.beginPath();
            ctx.arc(element.x, element.y, element.radius, 0, Math.PI * 2, true);
            if (element.fillStyle) {
              ctx.fill();
              break;
            }
            ctx.stroke();
            break;
          }
        }
      }

      const buffer = canvas.toBuffer();

      await ExportsModel.create({ canvasId });
      res.send(`<html>${buffer.toString()}</html>`);
    } catch (error) {
      res.sendStatus(500);
    }
  }
);

app.listen(8000, function () {
  console.log("Listening on port 8000");
});
