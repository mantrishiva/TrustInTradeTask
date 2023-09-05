const { createUserTable, insertUserData, getAllUsers, getUser, addMarchant, creatateMarchantTable, checkMarchant, createProductTable, addProduct, addMarchantUser, createMerchantIUserTable, getMarchantUsers, getMarchantProducts, getAllProducts, insertRoleData, roleTable, getRole, getAllMarchants, verifyMarchants, verifyProducts } = require('../model/users')
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken');
const secretKey = 'secretkey';
const addUser = async (req, res) => {
    const { fullName, email, status, password, gender, dob } = req.body
    try {
        createUserTable()
        const currentDate = new Date()
        const id = uuidv4()
        const response = await insertUserData(id, fullName, email, status, password, gender, dob, currentDate, req.body.fullName)
        res.send(response)
    } catch (err) {
        res.send(err)
    }
}

const getUsers = async (req, res) => {
    try {
        const response = await getAllUsers();
        res.send(response)
    } catch (err) {
        res.send(err)
    }
}

const Login = async (request, response) => {
    try {
        const result = await getUser(request.body.email);
        console.log(request.body.password, result);
        // bcrypt.hash(res[0].password, 10, (err,hash) => {
        bcrypt.compare(request?.body?.password, result[0].password, (err, res) => {
            if (res) {
                jwt.sign(result[0], secretKey, (err, token) => {
                    return response.cookie("access_token", token, {
                        httpOnly: false,
                    })
                        .status(200)
                        .json({ message: "Logged in successfully", id: result[0].id });
                })
            }
        })
        // })
    } catch (err) {
        console.log(err);
    }
}

const checkMarchantDetails = async (req, res) => {
    try {
        const result = await checkMarchant(req.params.userId)
        if (result.length > 0) {
            return res.send({ message: 'marchant already exist', status: true })
        } else res.send({ message: 'marchant not exists', status: false })
    } catch (err) {
        res.send(err)
    }
}

const addMarchantDetails = async (req, res) => {
    try {
        const { name, email, status, date_found, created_by } = req.body;
        creatateMarchantTable();
        const created_at = new Date();
        const marchantId = uuidv4();
        const response = await addMarchant(marchantId, name, email, status, date_found, created_at, created_by)
        return res.send({ message: 'marchant added successfully' }).status(200);
    } catch (err) {
        res.send(err)
    }
}

const addProductDetails = async (req, res) => {
    try {
        createProductTable();
        const { name, merchantId, price, status, createdAt, createdBy } = req.body;
        const id = uuidv4();
        const result = await addProduct(id, name, merchantId, price, status, createdAt, createdBy);
        res.send(result).status(200)
    } catch (err) {
        res.send(err);
    }
}

const assignRole = async (req, res) => {
    try {
        const { name, userId, role, marchantId } = req.body;
        const id = uuidv4();
        createMerchantIUserTable();
        const result = await addMarchantUser(id, name, userId, role, marchantId);
        res.send({ status: 200, message: result })
    } catch (err) {
        res.send(err)
    }
}

const getMarchantEmployees = async (req, res) => {
    try {
        const marchantId = req.params.marchantId;
        const result = await getMarchantUsers(marchantId)
        res.send(result)
    } catch (err) {
        res.send(err);
    }
}

const getMarchProducts = async (req, res) => {
    try {
        console.log('req', req.params);
        const result = await getMarchantProducts(req.params.marchantId);
        res.send(result).status(200)
    } catch (err) {
        res.send(err).status(500)
    }
}

const getProducts = async (req, res) => {
    try {
        const result = await getAllProducts();
        res.send(result).status(200);
    } catch (err) {
        res.send(err).status(500)
    }
}

const addRole = async (req, res) => {
    try {
        roleTable();
        const { name, email, role } = req.body;
        const id = uuidv4();
        const result = await insertRoleData(id, name, email, role)
        res.send({ message: 'role added successfully', status: 200, data: result })
    } catch (err) {
        res.send(err).status(500)
    }
}

const getRoleData = async (req, res) => {
    try {
        console.log('getRole', req);
        const result = await getRole(req.params.email);
        res.send(result).status(200);
    } catch (err) {
        res.send(err).status(500)
    }
}

const getMarchants = async (req, res) => {
    try {
        const result = await getAllMarchants();
        res.send(result).status(200)
    } catch (err) {
        res.send(err).status(500)
    }
}

const verifyMarchant = async (req, res) => {
    try {
        const {id, verify} = req.body;
        const result = await verifyMarchants(verify, id)
        res.send(result).status(200)
    }catch(err) {
        res.send(err).status(500);
    }
}

const verifyProduct = async (req,res) => {
    try{
        const { id, verify} = req.body;
        const result = await verifyProducts(verify, id)
        res.send(result).status(200)
    }catch(err) {
        res.send(err).status(500)
    }
}

module.exports = {
    addUser,
    getUsers,
    Login,
    addMarchantDetails,
    checkMarchantDetails,
    addProductDetails,
    assignRole,
    getMarchantEmployees,
    getMarchProducts,
    getProducts,
    addRole,
    getRoleData,
    getMarchants,
    verifyMarchant,
    verifyProduct
}