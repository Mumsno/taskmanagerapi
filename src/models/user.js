const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jtw = require('jsonwebtoken')
const Task = require('./task')

const SECRET = process.env.JWT_SECRET

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: Buffer
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error('Password must not contain password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},
    {
        timestamps: true
    })

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) throw new Error('No user found with that email')

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) throw new Error('Invalid Password')

    return user
}

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jtw.sign({ _id: user._id.toString() }, SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const user = this
    const tasks = await Task.find({ owner: user._id })
    debugger;
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User