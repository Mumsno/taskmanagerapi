const mongoose = require('mongoose')

const connectionURL = process.env.MONGO_URL
mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    
})

