import { Router } from 'express';
import ContactController from '../controllers/ContactController';
import { validateIdentifyPayload } from "../middlewares/validateIdentifyPayload";

const router = Router();

router.post('/identify', validateIdentifyPayload, ContactController.identifyContact);
export default router;
