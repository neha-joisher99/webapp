const express= require('express');
const  User  = require('../models').User
const logger=require('../logger/index.js')
// const statsd = require('node-statsd')
// const client = new statsd({ host : 'localhost', port : 8125})

const postUsers= async(req,res)=>{
   // client.increment('post-user')
    const {first_name, last_name, email, password} = req.body
    try{
        const user = User.create({first_name, last_name, email, password})
        logger.info(`User ${first_name} ${last_name} with ${email} created successfully!`)
        return res.status(200).send()
    }catch(err){
        console.log('Cannot create', err)
        logger.error(`Cannot create user, ${err}`)
        //return res.status(400).json(err)
    }
}

const getUsers= async(req,res)=>{
//client.increment('get-user')
   try{ 
    User.findAll()
   }catch(err){
    console.log('Cannot get', err)
   }
}

module.exports={
    getUsers
}