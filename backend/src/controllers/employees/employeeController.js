import employeeModel from '../../models/employees/employees.js'

const employeeController = {}

employeeController.getEmployees = async(req,res) => {
    try {
        const response = await employeeModel.find()
        if(!response) return res.status(404).json({ message: 'No employees found' })
        return res.status(200).json({data: response})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

employeeController.insertEmployee = async(req,res) => {
    try {
        const {
            name,
            last_name,
            email,
            password,
            position,
            hire_date
        } = req.body

        const payload = {
            name,
            last_name,
            email,
            password,
            position,
            hire_date,
            is_active: true
        }

        const newEmployee = await employeeModel.save(payload)
        if(!newEmployee) return res.status(400).json({ message: 'Data not save' })
        return res.status(200).json({message: "Data save", data: newEmployee })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

employeeController.updateEmployee = async(req,res) => {
    try{
        const {
            name,
            last_name,
            email,
            password,
            position,
            hire_date,
            is_active
        } = req.body

        const payload = {
            name,
            last_name,
            email,
            password,
            position,
            hire_date,
            is_active
        }
        const response = await employeeModel.findById(req.params.id)
        if(!response) return res.status(404).json({ message: 'Employee not found' })
        const employeeUpdated = await employeeModel.findByIdAndUpdate(req.params.id, payload, { new: true })
    if(!employeeUpdated) return res.status(400).json({ message: 'Employee not updated' })
        return res.status(200).json({ message: "Data updated", data: employeeUpdated })
    } 
    catch(error){
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

employeeController.deleteEmployee = async(req,res) => {
    try{
        const response = await employeeModel.findById(req.params.id)
        if(!response) return res.status(404).json({ message: 'Employee not found' })
        const employeeDeleted = await employeeModel.findByIdAndDelete(req.params.id)
        if(!employeeDeleted) return res.status(400).json({ message: 'Employee not deleted' })
        return res.status(200).json({ message: "Data deleted", data: employeeDeleted })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

export default employeeController
