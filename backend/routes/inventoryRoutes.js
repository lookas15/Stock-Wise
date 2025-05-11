import express from 'express';
import inventoryController from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', inventoryController.getAllItems);
router.post('/', inventoryController.addItem);
router.put('/:id', inventoryController.updateItem);
router.delete('/:id', inventoryController.deleteItem);

export default router;
    