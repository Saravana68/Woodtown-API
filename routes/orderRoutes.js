const express = require('express');
const router = express.Router();

const { authorizePermission, authenticateUser } = require('../middleware/authentication');

const {
    createOrder,
    getSingleOrder,
    getAllOrders,
    updateOrder,
    getCurrentUserOrders
} = require('../controllers/orderController');



router.route('/')
    .get(authenticateUser,authorizePermission('admin'),getAllOrders)
    .post(authenticateUser,createOrder);

router.route('/showMyOrders').get(authenticateUser,getCurrentUserOrders);

router.route('/:id')
    .get(authenticateUser,getSingleOrder)
    .patch(authenticateUser,updateOrder);


module.exports = router;



