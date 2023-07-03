import mongoose from "mongoose";

const Connection = async (username, password) => {
    const URL = `mongodb://${username}:${password}@ac-gdk2ejc-shard-00-00.8dc4hnz.mongodb.net:27017,ac-gdk2ejc-shard-00-01.8dc4hnz.mongodb.net:27017,ac-gdk2ejc-shard-00-02.8dc4hnz.mongodb.net:27017/?ssl=true&replicaSet=atlas-fjfarh-shard-0&authSource=admin&retryWrites=true&w=majority`;

    try {
        await mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error while connecting with the database', error);
    }
}

export default Connection;
