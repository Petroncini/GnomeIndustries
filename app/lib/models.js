import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min: 3,
        max: 25,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
})


const contssssSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min: 3,
        max: 25,
        default:'Nome não adicionado'
    },
    type:{
        type:String,
        required:true,
    },
    pag:{
        type:Boolean,
        required:true,
        default:false,
    },
    scd:{
        type:String,
        default:'Sem Codigo DD'
    },
    due_date:{
        type:Date,
        default:new Date(1000, 11, 11)
    },
    pag_date:{
        type:Date,
        default:new Date(1000, 11, 11)
    },
    total:{
        type:Number,
        min:0,
        default:0.00
    },
    bol:{
    },
    comp:{
    },
    user_id:{
    },
}, { timestamps: true });


const fixNamesSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min: 3,
        max: 25,
    }
})


const forNameSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min: 3,
        max: 25,
    }
})

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Contssss = mongoose.models.Contssss || mongoose.model('Contssss', contssssSchema);
export const FixNames = mongoose.models.FixNames || mongoose.model('FixNames', fixNamesSchema);
export const ForName = mongoose.models.ForName || mongoose.model('ForName', forNameSchema);