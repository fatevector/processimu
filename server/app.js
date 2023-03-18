const express = require("express");
const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("./config.json");
const cors = require("cors");

const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/api", routes);

const PORT = config.port ?? 8080;

const start = async () => {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(config.mongoUri);
        console.log(chalk.green("MongoDB is connected"));
        app.listen(PORT, () => {
            console.log(
                chalk.green(`Server has been started on port ${PORT}...`)
            );
        });
    } catch (error) {
        console.log(chalk.red(error.message));
        process.exit(1);
    }
};

start();
