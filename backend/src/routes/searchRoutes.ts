import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest";
import * as searchController from "../controllers/searchControllers";
import { searchQueryDto } from "../dtos/dtos";
import { authenticateJWT } from "../middleware/jwtAutenticate";
const router = Router();

router.get("/:query/:provider/:limit/:offset", validateRequest(searchQueryDto, "params"), searchController.searchQuery);

export default router;
