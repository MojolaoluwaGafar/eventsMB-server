const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema= new Schema({
    photo: {
        type: String,
        required : true,
    },
    title : {
        type : String,
        required: true,
        trim : true,
    },
    hostName: {
    type: String,
    required: true,
    trim: true,
    },
    date : {
        type : Date,
        required : true,
    },
    timeStart : {
        type : String,
        required : true,
    },
    timeEnd : {
        type : String,
        required : true,
    },
    location : {
        type : String,
        required : function (){
            return this.online === false
        },
    },
    online : {
        type : Boolean,
        default : false,
    },
    description : {
        type :String,
        required : true,
        trim : true,
    },
    category : {
     type : String,
     enum : ["sports","party", "concert", "tech","religion", "education"],
     required : true,  
    },
    tags : {
        type : [String],
        required : true
    },
    free: {
        type : Boolean,
        default : false,
    },
    regularEnabled : {
        type : Boolean,
        default : false
    },
    regular : {
        type : Number,
        required : function (){
            return !this.free && this.regularEnabled
        },
        min : 0,
    },
    vipEnabled : {
        type : Boolean,
        default : false,
    },
    vip : {
        type : Number,
        required : function(){
            return !this.free && this.vipEnabled
        },
        min : 0,
    },
    hostedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" ,
            required : true,
        }
    ],
    locationCoords: {
       type:
       { 
        type: String,
        enum: ["Point"],
        required: true ,
        default: "Point" },
        coordinates: 
        { 
            type: [Number],
            index: "2dsphere" ,
            required: true 
        },
    },

},
{timestamps : true}
);
eventSchema.index({ locationCoords: "2dsphere" });
module.exports = mongoose.model("Event", eventSchema)