import express from "express";
import { router } from './config/Routes';

const app = express();

app.use(express.json());
app.use(router);

app.listen(3000, () => {
  console.clear();
  console.log("Aplicação ApiNode rodando na porta 3000");
});
