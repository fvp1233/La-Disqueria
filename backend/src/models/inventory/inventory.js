import mongoose, { Schema, model } from 'mongoose';

const inventorySchema = new Schema({
  
  productId: {
    type: Schema.Types.ObjectId,
    refPath: 'productType'
  },

  productType: {
    type: String
  },

  sku: {
    type: String
  },

  stock: {
    type: Number
  },

  location: {
    type: String
  },

  supplierId: [
    {
      supplierId: {
        type: Schema.Types.ObjectId,
        ref: 'supplier',
      }
    }
  ]

});

export default model('inventory', inventorySchema, 'inventory');
