/*
    -name
    -last_name
    -email
    -password
    is_active
    -loginAttempts
    -time_out
*/

import mongoose, {Schema, model} from 'mongoose'

const adminModel = new Schema({
    name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type:String
    },
    password: {
        type: String
    },
    is_active: {
        type: Boolean
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    time_out: {
        type: Date,
        default: null
    }
}, {timestamps: true})

export default model('admins', adminModel)