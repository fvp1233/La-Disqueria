/*
    -name
    -genre[String]
    -origin
    -biography
    -image
    -public_id
    -social_links{
        spotify
        instagram
        website
    }
*/

import { Schema, model } from "mongoose";

const artistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    genre: [
      {
        type: String,
      },
    ],
    origin: {
      type: String,
    },
    biography: {
      type: String,
    },
    image: {
      type: String,
    },
    public_id: {
      type: String,
    },
    social_links: {
      spotify: {
        type: String,
      },
      instagram: {
        type: String,
      },
      website: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Artists", artistSchema, "artists");
