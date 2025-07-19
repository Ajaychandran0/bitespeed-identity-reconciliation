import { Router } from 'express';
import ContactController from '../controllers/ContactController';
import { identifyValidationRules, validateIdentify  } from "../middlewares/validateIdentifyPayload";

const router = Router();

router.post('/identify', identifyValidationRules, validateIdentify, ContactController.identifyContact);
export default router;
