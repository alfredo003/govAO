import { Router } from "express";
import ministersRoutes from "./ministers.routes";
import presidentRoutes from "./president.routes";


const routers = Router();

routers.use("/ministros", ministersRoutes);
routers.use("/presidencia", presidentRoutes);


export default routers;