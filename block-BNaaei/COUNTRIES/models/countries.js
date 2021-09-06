let mongoose = require('mongoose');
let Schema = mongoose.Schema;




let countriesSchema = new Schema(
  {
    name: { type: String, required: true },
    states: [{ type: Schema.Types.ObjectId, ref: 'States' }],
    continent: String,
    population: Number,
    ethnicity: [String],
    neighbouring_countries: [{ type: Schema.Types.ObjectId, ref: 'Countries' }],
    area: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Countries', countriesSchema);
