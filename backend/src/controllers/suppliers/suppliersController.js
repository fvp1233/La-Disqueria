import supplierModel from '../../models/suppliers/suppliers.js'

const supplierController= {}

supplierController.getSuppliers = async(req,res) => {
    try {
        const response = await supplierModel.find();
        if(!response){
            return res.status(404).json({message: 'Suppliers not found'});
        }
        res.json(response);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

supplierController.insertSuppliers = async(req,res) => {
    try {
        const {
            company,
            contact_name,
            email,
            phone,
            country,
            city,
            catalog
        } = req.body

        if(!company || !contact_name || !email || !phone || !country || !city || !catalog){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        //Validación del número de teléfono de El Salvador (XXXX-XXXX)
        if(!/^\d{4}-\d{4}$/.test(phone)){
            return res.status(400).json({
                message: "Phone number must be XXXX-XXXX"
            })
        }

        //Validación del correo electrónico
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            return res.status(400).json({
                message: "Email must be valid"
            })
        }

        if(catalog && catalog.length > 0){
            for(const item of catalog){
                if(!['vinyls', 'turntables', 'accessories', 'cds'].includes(item.type)){ //Includes valida si lo que se escriba, dentro del array exista
                    return res.status(400).json({message: `Invalid product type: ${item.type}. Must be 'vinyls', 'turntables', 'accessories' or 'cds'`})
                }
            }
        }

        const payload = new supplierModel({
            company,
            contact_name,
            email,
            phone,
            country,
            city,
            catalog
        })

        await payload.save()

        return res.status(200).json({
            message: "supplier saved",
            data: payload
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

supplierController.updateSupplier = async(req,res) => {
    try {
        const response = await supplierModel.findById(req.params.id)
        if(!response) {
            return res.status(400).json({message: "Supplier not found"})
        }

        const {
            company,
            contact_name,
            email,
            phone,
            country,
            city,
            catalog
        } = req.body

        if(!company || !contact_name || !email || !phone || !country || !city || !catalog){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        //Validación del número de teléfono de El Salvador (XXXX-XXXX)
        if(!/^\d{4}-\d{4}$/.test(phone)){
            return res.status(400).json({
                message: "Phone number must be XXXX-XXXX"
            })
        }

        //Validación del correo electrónico
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            return res.status(400).json({
                message: "Email must be valid"
            })
        }

        if(catalog && catalog.length > 0){ //Si los objetos del catalogo no son 0
            for(const item of catalog){ //Por cada item dentro del catalogo
                if(!['vinyls', 'turntables', 'accessories', 'cds'].includes(item.type)){ //Includes valida si lo que se escriba, dentro del array exista
                    return res.status(400).json({message: `Invalid product type: ${item.type}. Must be 'vinyls', 'turntables', 'accessories' or 'cds'`})
                }
            }
        }

        const payload = {
            company,
            contact_name,
            email,
            phone,
            country,
            city,
            catalog
        }

        await supplierModel.findByIdAndUpdate(req.params.id, payload)

        return res.status(200).json({
            message: "Supplier updated",
            data: payload
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

supplierController.deleteSupplier = async(req,res) => {
    try {
        const response = supplierModel.findById(req.params.id)
        if(!response) {
            return res.status(400).json({message: "Supplier not found"})
        }
        await supplierModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            message: "Supplier deleted"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}
export default supplierController