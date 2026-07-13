/*
    -name
    -last_name 
    -email
    -password
    -position
    -hire_date
    -is_active
*/

import mongoose, {Schema, model} from 'mongoose'

const employeeModel = new Schema({
    name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    position: {
        type: String
    },
    hire_date:{
        type: Date
    },
    is_active: {
        type:Boolean
    }
}, {
    timestamps: true
})

export default model('employees', employeeModel)