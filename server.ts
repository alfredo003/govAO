import express from "express";
import routers from "./src/routes";

const PORT = 3000;
const app = express();
app.use(express.json());

app.use("/api",routers);

app.listen(PORT, () => console.log(`Running server on port: ${PORT}`));
