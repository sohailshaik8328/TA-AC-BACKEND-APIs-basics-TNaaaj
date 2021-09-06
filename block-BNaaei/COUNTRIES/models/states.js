let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let statesSchema = new Schema(
  {
    name_of_state: { type: String, required: true },
    population: Number,
    country: [{ type: Schema.Types.ObjectId, ref: 'Countries' }],
    area: Number,
    neighbouring_states: [{ type: Schema.Types.ObjectId, ref: 'States' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('States', statesSchema);
