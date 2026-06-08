/*
    -title
    -artistId
    -label
    -genre{String}
    -tear
    -format
    -track[
        -position
        -title
        -duration
    ]
    -album_duration
    -edition
    -price
    -images{String}
    -tags{String}
    -isAvailable
*/
import mongoose, {Schema, model} from 'mongoose'

const cdsSchema = new Schema({
    title: {
        type: String
    },
    aritstId: {
        type: Schema.Types.ObjectId,
        ref:"artists", 
    },
    label: {
        type: String
    },
    genre: [
        {
            type: String
        }
    ],
    year: {
        type: String
    },
    format: {
        type: String
    },
    tracks: [
        {
            position: {
                type: Number
            },
            title: {
                type: String
            },
            duration: {
                type: String
            }
        }
    ],
    album_duration: {
        type: String
    },
    edition: {
        type: String
    },
    price: {
        type: Number
    },
    images: [
        {
            public_id: {
                type: String
            },
            image: {
                type: String
            }
        }
    ],
    tags: [
        {
            type: String
        }
    ],
    isAvailable: {
        type: Boolean
    }    
})

export default model("cds", cdsSchema)