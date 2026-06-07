import mongoose, { Schema, model } from 'mongoose';

const inventorySchema = new Schema({
  
  productId: {
    type: Schema.Types.ObjectId,
    refPath: 'productType',
    required: true
  },

  productType: {
    type: String,
    required: true
  },

  sku: {
    type: String,
    required: true
  },

  stock: {
    type: Number,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  supplierId: [
    {
      supplierId: {
        type: Schema.Types.ObjectId,
        ref: 'supplier',
        required: true
      }
    }
  ]

});

export default model('inventory', inventorySchema, 'inventory');
