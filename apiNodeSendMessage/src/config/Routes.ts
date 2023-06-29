import { Router } from "express";
import { ApiNodeController } from "../controllers/ApiNode.controller";

const router: Router = Router();

router.post('/cadastrar', new ApiNodeController().cadastrarApiNode);

export { router }