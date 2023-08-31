import {Router} from 'express'
const router=Router();

import indexCtrl from '../controllers/index.controller.js'

router.get('/',/*isAuthenticated,*/indexCtrl.renderIndex);
router.post('/chat',/*isAuthenticated,*/indexCtrl.chat);

export default router;
