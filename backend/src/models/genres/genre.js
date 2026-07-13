/*
    -name
*/

import { Schema, model } from "mongoose";

const genreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Genres", genreSchema, "genres");
