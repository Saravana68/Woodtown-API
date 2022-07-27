const express = require('express');
const router = express.Router();

const {authenticateUser,authorizePermission} = require('../middleware/authentication');

const {
    getAllUsers,
    getSingleUser,
    updateUser,
    updateUserPassword,
    showCurrentUser
} = require('../controllers/userController');


router.route('/').get(authenticateUser, authorizePermission('admin'),getAllUsers);
router.route('/showMe').get(authenticateUser,showCurrentUser);
router.route('/updateUser').patch(authenticateUser,updateUser);
router.route('/updateUserPassword').patch(authenticateUser,updateUserPassword);

/* this :id should be always in bottom */
router.route('/:id').get(authenticateUser,getSingleUser);

module.exports = router;