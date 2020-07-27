const mongoose = require('mongoose');
/**
 * mongoose connect
 * Here first-user-database is the Database ie main collection name name
 * and user that is being passed in the schema is the collection name
 */
const connectDb = async () => {
    try{
        const connected = await mongoose.connect('mongodb+srv://user_1:Password@123@first-user-database.jcwnx.mongodb.net/Users?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('connected');
    }catch(err){
        console.log(err);
        console.log('disconnected');
    }
}
connectDb();
module.exports = connectDb;
