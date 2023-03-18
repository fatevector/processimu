const { Schema, model } = require("mongoose");

const schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            uniq: true
        },
        password: {
            type: String,
            required: true
        },
        models: []
    },
    {
        timestamps: true
    }
);

module.exports = model("User", schema);
