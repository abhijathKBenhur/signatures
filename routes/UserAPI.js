const User = require('../db-config/user.schema')
const express = require('express')
const router = express.Router()


registerUser = (req, res) => {
    console.log("signing up",req.body)
    const body = req.body
    body.balance = 1000;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a user',
        })
    }
    const newUser = new User(body)

    if (!newUser) {
        return res.status(400).json({ success: false, error: err })
    }

    newUser
        .save()
        .then((user,b) => {
            return res.status(201).json({
                success: true,
                data: user,
                message: 'New user created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'New user not created!',
            })
        })
}

getUserInfo = async (req, res) => {
    let findCriteria = {}
    if(req.body.metamaskId){
        findCriteria.metamaskId = req.body.metamaskId
    }
    if(req.body.userID){
        findCriteria.userID = req.body.userID
    }
    await User.findOne(findCriteria, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!user) {
            return res
                .status(404)
                .json({ success: true, data: [] })
        }
        console.log("Found user with " , req.body.userName, req.body.password)
        return res.status(200).json({ success: true, data: user })
    }).catch(err => {
        return res.status(200).json({ success: false, data: err })
    })
}


login = async (req, res) => {
    console.log("checking login",req.body)
    await User.findOne({ userName: req.body.userName, password: req.body.password }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!user) {
            return res
                .status(404)
                .json({ success: true, data: [] })
        }
        console.log("Found user with " , req.body.userName, req.body.password)
        return res.status(200).json({ success: true, data: user })
    }).catch(err => {
        return res.status(200).json({ success: false, data: err })
    })
}

router.post('/registerUser', registerUser)
router.post('/login', login)
router.post('/getUserInfo', getUserInfo)



module.exports = router
