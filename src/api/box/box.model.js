import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const BoxSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  valor: {
      type: String,
      required: true
  },
  estado: {
      type: String,
      required: true,
      enum: ['Bloqueado', 'Disponible'],
      default: 'Disponible'
  },
  owner: {
    ref: 'User',
    type: Schema.Types.ObjectId,
    required: true
  }
}, { timestamps: true });
export default mongoose.model('box', BoxSchema);