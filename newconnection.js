const mongoose = require("mongoose");
const uri = "mongodb+srv://YogeshMishra:yogeshmishraji@dogesh.4zht5.mongodb.net/?retryWrites=true&w=majority&appName=Dogesh";


function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull")

    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };