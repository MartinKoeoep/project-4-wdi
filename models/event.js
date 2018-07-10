const mongoose = require('mongoose');
const moment = require('moment');


const timeSlotSchema = new mongoose.Schema({
  date: {type: Date, required: true},
  startTime: {type: Date, required: true},
  votes: [{ type: mongoose.Schema.ObjectId, ref: 'User', required: true }]
});


const eventSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: String,
  timeSlots: [timeSlotSchema],
  length: {type: Number, required: true},
  address: String,
  location: { lat: Number, lng: Number },
  private: { type: Boolean, default: true },
  attendees: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  invitees: [String],
  pendingAttendees: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  image: String,
  organizer: { type: mongoose.Schema.ObjectId, ref: 'User' }
});

// eventSchema.pre('save', function(next){
//   this.timeSlots.forEach(timeSlot=>{
//     const date = timeSlot.date;
//     timeSlot.date = moment(date).format('YYYY-MM-DD');
//     console.log(timeSlot.date);
//     return timeSlot.date;
//   });
//   next();
// });


timeSlotSchema.path('date')
  .get(function formatDate(date){
    return moment(date).format('ddd, MMM Do');
  });


eventSchema.virtual('eventDates')
  .get(function() {
    return Array.from(new Set(this.timeSlots.map(slot => slot.date)));
  });

eventSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('Event', eventSchema);
