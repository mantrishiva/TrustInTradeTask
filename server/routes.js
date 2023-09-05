const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const { addUser, getUsers, Login, addMarchantDetails, checkMarchantDetails, addProductDetails, assignRole, getMarchantEmployees, getMarchProducts, getProducts, addRole, getRoleData, getMarchants, verifyMarchant, verifyProduct } = require('./controllers/users')
const { getUser } = require('./model/users')
const verifyUser = (req,res,next) => {
    console.log('verify user', req.headers); 
    jwt.verify(req.headers['authorization'].split(' ')[1], 'secretkey',async (err, result) => {
        if(err) {
            return res.status(401).send('unAuthorized user')
        }else {
            const response = await getUser(result.email);
            if (response.length>0) {
                next();
            }
        }
    })
}


router.post('/addUser', addUser);
router.get('/getUsers',verifyUser, getUsers);
router.post('/addMarchant', verifyUser, addMarchantDetails);
router.get('/checkMarchant/:userId',verifyUser,checkMarchantDetails);
router.post('/addProducts', verifyUser, addProductDetails);
router.post('/assignMarchantRoles', verifyUser, assignRole);
router.get('/getMarchantUsers/:marchantId', verifyUser, getMarchantEmployees)
router.get('/getMarchantProducts/:marchantId', verifyUser, getMarchProducts)
router.get('/getProducts',verifyUser, getProducts)
router.get('/getRole/:email', verifyUser, getRoleData)
router.post('/addRole', verifyUser, addRole);
router.get('/getMarchants', verifyUser, getMarchants)
router.put('/verifyMarchant', verifyUser, verifyMarchant);
router.put('verifyProduct', verifyUser, verifyProduct)
router.post('/login', Login);

module.exports= router;