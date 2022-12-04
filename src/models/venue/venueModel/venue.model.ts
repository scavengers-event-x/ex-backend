import { Model, model, Schema } from 'mongoose'

import { CollectionNames } from '../../../config'
import { EVenueType, IVenueMain } from '../venue.types'

const venueSchema = new Schema<IVenueMain>({
  name: {
    type: String,
    required: true
  },
  capacity: {
    type: {
      max: { type: Number, required: true },
      min: { type: Number }
    },
    required: true
  },
  contact: {
    type: [Number],
    required: true
  },
  inContract: { type: Boolean, default: false },
  location: { type: String, required: true },
  verified: { type: Boolean, default: false },
  price: [{
    paxRange: {
      from: { type: Number, required: true },
      to: { type: Number, required: true }
    },
    amount: { type: Number, required: true }
  }],
  remarks: { type: [String] },
  established: { type: Number },
  spaceIndoor: { type: Boolean, default: true },
  spaceOutdoor: { type: Boolean, default: true },
  venueType: { type: String, enum: [...Object.values(EVenueType)] },
  additionalService: {
    dj: { type: Number },
    spaceOnly: { type: Number }
  },
  bookedDates: [{
    date: Date,
    eventId: {
      type: Schema.Types.ObjectId,
      ref: CollectionNames.EVENT
    }
  }],
  image: {
    url: { type: String },
    public_id: { type: String }
  },
  deleted: { type: Boolean, default: false }
}, { strict: true, timestamps: { createdAt: true, updatedAt: 'modifiedAt' } })

const VenueModel: Model<IVenueMain> = model(CollectionNames.VENUE, venueSchema)

export { VenueModel }
