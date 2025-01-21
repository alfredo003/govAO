import { Router } from "express";
import GetMinistersUseCase from "../useCase/GetMinistersUseCase";

const ministersRoutes = Router();

ministersRoutes.get("/", async (req, res) => {
  const getMinistersUseCase = new GetMinistersUseCase();
  try {
    const url = "https://governo.gov.ao/ministro";
    const result = await getMinistersUseCase.execute(url);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
  } 
});

export default ministersRoutes;
