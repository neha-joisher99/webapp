const express= require('express');
const  User  = require('../models').User

const postUsers= async(req,res)=>{
    const {first_name, last_name, email, password} = req.body
    try{
        const user = User.create({first_name, last_name, email, password})
        return res.status(200).send()
    }catch(err){
        console.log('Cannot create', err)
        //return res.status(400).json(err)
    }
}

const getUsers= async(req,res)=>{
   try{ 
    User.findAll()
   }catch(err){
    console.log('Cannot get', err)
   }
}

module.exports={
    getUsers
}