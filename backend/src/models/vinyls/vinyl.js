/*
tittle,
artist_id,
label,
genre,
year,
format,
speed,
size,
color,
condition,
tracklist[{
side,
position,
tittle,
duration
}],
price,
images[{
image,
isCover
public_id
}],
tags
isAvailable
*/
import mongoose, { Schema, model } from "mongoose";

const vinylsSchema = new Schema({

    tittle: {
        type: String
    },
    artistId: {
        type: mongoose.Types.ObjectId,
        refer: "Artists"
    },
    label: {
        type: String
    },
    genre: {
        type: String
    },
    year: {
        type: Date
    },
    format: {
        type: String
    },
    speed: {
        type: String
    },
    size: {
        type: String
    },
    color: {
        type: String
    },
    condition: {
        type: String
    },
    trackList: [{
        side: {
            type: String
        },
        position: {
            type: String
        },
        song_name: {
            type: String
        },
        duration: {
            type: String
        }
    }],
    price: {
        type: Number
    },
    images: [{
        image: {
            type: String
        },
        public_id: {
            type: String
        },
        isCover: {
            type: Boolean
        }
    }],
    tags: {
        type: String
    },
    isAvailable: {
        type: Boolean
    }
}, {
    timestamps: true,
    strict: false
})
export default model("Vinyls", vinylsSchema)