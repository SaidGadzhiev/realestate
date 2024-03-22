import express from 'express';

const router = express.Router();

import * as ad from '../controllers/ad.js';
import { requireSignIn } from '../middlewares/auth.js';

router.post('/upload-image', requireSignIn, ad.uploadImage);
router.post('/remove-image', requireSignIn, ad.removeImage);
router.post('/ad', requireSignIn, ad.create);
router.get('/ads', ad.ads);

export default router;
