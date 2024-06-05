const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');

router.get('/searchByUser', voucherController.searchVouchersByUser);
router.get('/user/:id_user', voucherController.getVoucherByUserId);
router.get('/search', voucherController.searchVouchers);
router.post('/', voucherController.createVoucher);
router.put('/:id', voucherController.updateVoucher);
router.delete('/:id', voucherController.deleteVoucher);
router.get('/:id', voucherController.getVoucherById);
router.get('/', voucherController.getAllVouchers);

module.exports = router;
