import { Router } from "express";
import GetSpeechesUseCase from "../useCase/GetSpeechesUseCase";
import fs from 'fs'
import express, { Request, Response } from "express";
import puppeteer, { HTTPResponse } from "puppeteer";
import pdfParse from "pdf-parse";

const presidentRoutes = Router();

const getDataFromJsonAsync = async (filePath: string) => {
  try {
    // Lê o arquivo de forma assíncrona usando a API promises do fs
    const data = await fs.promises.readFile(filePath, "utf8");

    // Converte o conteúdo JSON para um objeto JavaScript
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    console.error("Erro ao ler o arquivo JSON:", error);
    return null;
  }
};

presidentRoutes.get("/discursos", async (req, res) => {
  const getSpeechesUseCase = new GetSpeechesUseCase();
  try {
    const speeches = await getSpeechesUseCase.execute(
      "https://governo.gov.ao/documentos/discurso"
    );
    res.json(speeches);
  } catch (error) {
    console.error("Error fetching speeches:", error);
    res.status(500).json({
      message: "An error occurred while fetching the speeches.",
    });
  }
});

presidentRoutes.get("/discursos/:data_speeche",  async (req,res) => {
    const { data_speeche } = req.params;

  });

export default presidentRoutes;
