const express= require('express');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
const db = require('../models');
const logger=require('../logger/index.js')
// const statsd = require('node-statsd')
// const client = new statsd({ host : 'localhost', port : 8125})


const getAssignemnts = (autheticate)= async (req, res) =>{
  //client.increment('get-assignment')
    try{
      const contentLength = req.get('Content-Length');
      console.log(contentLength)
      console.log('In get')
      console.log(req.query)
      console.log(req.body)

          if (Object.keys(req.query).length > 0) {
            logger.error(`API Assignments - Request Get ALL- Bad request - conatins query paramaters - ${Object.keys(req.query)}`);
            return res.status(400).send();
          }
          if (contentLength>0 ){
            const requestBody = JSON.stringify(req.body);
            logger.error(`API Assignments - Request Get ALL - Bad request - contains body - ${requestBody}`);
            return res.status(400).send();
          }
          else {
            const assignments = await db.assignments.findAll({
                attributes: [
                  'id',  'name', 'points', 'num_of_attempts',  'deadline',  'assignment_created', 'assignment_updated',
                ],
              });
              logger.info('API Assignments - Request Get ALL - Assignements fetched successfully!')
              res.status(200).json(assignments);
            }
    } catch (error) {
              console.error(error);
              logger.error(`API Assignments - Request Get ALL - Bad request ${error}`)
              res.status(400).send();
            }
}

const postAssignemnts=(authenticate)= async(req,res)=>{ 
 // client.increment('post-assignment')
  console.log(req.query)
  console.log(req.body)
  console.log(!req.body)
  const contentLength = req.get('Content-Length');
  if (Object.keys(req.query).length > 0) {
    logger.error(`API Assignments - Request post - Bad request query paramaters ${req.query}`);
    return res.status(400).send();
  }
  if (contentLength===0 ){
    logger.error(`API Assignments - Request post - Bad request - Empty Body`);
    return res.status(400).send();
  }

  console.log('In post')
  const { name, points, num_of_attempts, deadline, assignment_created, assignment_updated } = req.body
    try {
            console.log('in here')
            console.log(req.body);
            const { name, points, num_of_attempts, deadline } = req.body
             
            if (!name || /^\d+$/.test(name) || points === undefined || points < 1 || points > 10 || num_of_attempts === undefined || num_of_attempts < 1 || !deadline) {
              const requestBody = JSON.stringify(req.body);
              logger.error(`API Assignments - Request post - Bad request body ${requestBody}`)
              return res.status(400).send();
            }

            const allowedKeys = ['name', 'points', 'num_of_attempts', 'deadline'];
            const requestedKeys = Object.keys(req.body);
            if (
              allowedKeys.some(key => !requestedKeys.includes(key)) ||  // Check if any allowed key is missing
              requestedKeys.some(key => !allowedKeys.includes(key))  // Check if there are extra keys
            ) {
              logger.info(`API Assignments - Request post - Bad request body ${req.body}`)
              return res.status(400).send();
            }
 
            console.log(req.user.id)
            const newAssignment = await db.assignments.create({ name, points,num_of_attempts,deadline,accountId:req.user.id });
            const assignmentData = newAssignment.toJSON({
              attributes: ['id', 'name', 'points', 'num_of_attempts', 'deadline', 'assignment_created', 'assignment_updated'],
            });
        
            const reorderedAssignmentData = {
              id: assignmentData.id,
              name: assignmentData.name,
              points: assignmentData.points,
              num_of_attempts: assignmentData.num_of_attempts,
              deadline: assignmentData.deadline,
              assignment_created: assignmentData.assignment_created,
              assignment_updated: assignmentData.assignment_updated,
            };
            logger.info('API Assignments - Request post - Assignment posted successfully!')
            res.status(201).json(reorderedAssignmentData);

            } catch (SequelizeDatabaseError) {
              logger.error(`API Assignments - Request post - Bad request - ${SequelizeDatabaseError}`)
              res.status(400).send();
            }
  }


  const deleteAssignments=(autheticate)=async(req,res)=>{
   // client.increment('delete-assignment')
    console.log('in delete')
    console.log(req.query)
    console.log(req.body)

    if (Object.keys(req.query).length > 0) {
      logger.error(`API Assignments - Request delete - Bad request - conatins query paramaters - ${Object.keys(req.query)}`);
      return res.status(400).send();
    }
        const contentLength = req.get('Content-Length');

        if (contentLength>0 ){
          const requestBody = JSON.stringify(req.body);
          logger.error(`API Assignments - Request delete - Bad request - contains body - ${requestBody}`);
          return res.status(400).send();
        }
      

    console.log(req.user.id)
    const assignmentIdDeleteMapp = req.params.id;
    console.log(assignmentIdDeleteMapp)
    
    // console.log(assignmentId)
    let assignment=null;   
    try {
      const assignment = await db.assignments.findOne({
        where: { id: assignmentIdDeleteMapp }
      });
  
      if (assignment !== null) {
        if (assignment.accountId==req.user.id){
            await assignment.destroy();
            logger.info(`API Assignment - Request delete - Assignement ${assignment.id} deleted successfully!`)
            res.status(204).send(); 
        }else {
          logger.error(`API Assignment - Request delete - User ${req.user.id} is trying to delete assignements for user ${assignment.accountId}. Action Forbidden`)
          res.status(403).send()
        }
       } 
    } catch (SequelizeDatabaseError) {
      logger.error(`API Assignment - Request delete - Assignement  ${assignmentIdDeleteMapp} not found!`)
      res.status(404).send(); 
    }
  }  


const getAssignment=(autheticate)=async(req,res)=>{
  //client.increment('get-assignment')
  console.log('in get:id')

  console.log(req.query)
  console.log(req.body)
  if (Object.keys(req.query).length > 0) {
    logger.error(`API Assignments - Request Get -  Bad request - conatins query paramaters - ${Object.keys(req.query)}`);
    return res.status(400).send();
  }

  const contentLength = req.get('Content-Length');
 
  if (contentLength>0 ){
    const requestBody = JSON.stringify(req.body);
    logger.error(`API Assignments - Request Get - Bad request - contains body - ${requestBody}`);
    return res.status(400).send();
  }

  const assignmentIdGet = req.params.id;
  console.log(assignmentIdGet)
  let assignment=null;   
  try {
     assignment = await db.assignments.findOne({
      where: { id: assignmentIdGet }
    });
   
    if (!assignment) {
      logger.error(`API Assignments - Request Get - Assignment not found`)
      return res.status(404).send();
    }

    const assignmentData = assignment.toJSON({
      attributes: ['id', 'name', 'points', 'num_of_attempts', 'deadline', 'assignment_created', 'assignment_updated'],
    });

    const reorderedAssignmentDataGet = {
      id: assignmentData.id,
      name: assignmentData.name,
      points: assignmentData.points,
      num_of_attempts: assignmentData.num_of_attempts,
      deadline: assignmentData.deadline,
      assignment_created: assignmentData.assignment_created,
      assignment_updated: assignmentData.assignment_updated,
    };

    logger.info(`API Assignments - Request Get - Assignment fetched successfully!`)
    res.status(200).json(reorderedAssignmentDataGet);
  }catch (error) {
    logger.error(`API Assignments - Request Get - Bad request ${error}`)
    console.error(error);
    res.status(400).send();
  }
}

const patchAssignment=(autheticate)=async(req,res)=>{
  //client.increment('patch-assignment')
  logger.error(`API Assignments - Request Patch - Method Not allowed `)
  return res.status(405).send();
}





const putAssignemnts=(autheticate)=async(req,res)=>{
 // client.increment('put-assignment')
  console.log('In put')
  const assignmentIdPUT = req.params.id;   // assignment-id from paramaters
  console.log('assignmentIdPUT :', assignmentIdPUT)
  const userIdPut=  req.user.id            //user-id doing the operation
  console.log('userIdPut :' , userIdPut)
  const updatedAssignmentData = req.body;
  console.log('updatedAssignmentData :' , updatedAssignmentData)

  if (Object.keys(req.query).length > 0) {
    console.log('in query')
    logger.error(`API Assignments - Request put - Bad request - conatins query paramaters - ${Object.keys(req.query)}`);
    return res.status(400).send();
  }

  const contentLength = req.get('Content-Length');
  if (contentLength==0 ){
    console.log('in contentLength')
    logger.error(`API Assignments - Request put - Bad request - No body`)
    return res.status(400).send();
  }

  const allowedKeys = ['name', 'points', 'num_of_attempts', 'deadline'];
  const requestedKeys = Object.keys(req.body);
  if (
    allowedKeys.some(key => !requestedKeys.includes(key)) ||  // Check if any allowed key is missing
    requestedKeys.some(key => !allowedKeys.includes(key))  // Check if there are extra keys
  ) {
    const requestBody = JSON.stringify(req.body);
    logger.error(`API Assignments - Request put - Bad request body ${requestBody}`)
    return res.status(400).send();
  }

  // Find the assignment with the specified ID
  let assignment=null;   
  try {
     assignment = await db.assignments.findOne({
      where: { id: assignmentIdPUT }
    });
    console.log(assignment)
    if (assignment === null) {
      console.log('Not found')
      logger.error(`API Assignments - Request put - Assignement with id ${assignmentIdPUT} not found!`)
      return res.status(404).send();
    }
      if (assignment.accountId==userIdPut){
  // Validate the request body
  if (
    typeof updatedAssignmentData.name !== 'string' || typeof updatedAssignmentData.points !== 'number' ||
    typeof updatedAssignmentData.num_of_attempts !== 'number' || typeof updatedAssignmentData.deadline !== 'string'
  ) {
    logger.error(`API Assignments - Request put - Bad request`);
    return res.status(400).send() }

  // Update the assignment with the provided data
  assignment.name = updatedAssignmentData.name;
  assignment.points = updatedAssignmentData.points;
  assignment.num_of_attempts = updatedAssignmentData.num_of_attempts;
  assignment.deadline = updatedAssignmentData.deadline;
  assignment.assignment_updated = new Date().toISOString();
  try{
    await assignment.save();
    console.log('in save')
    console.log(updatedAssignmentData)
    logger.info(`API Assignments - Request put - Assignement updated successfully for user ${userIdPut}`)
    res.status(204).send();
  }catch(SequelizeDatabaseError){
      logger.error(`API Assignments - Request put - ${SequelizeDatabaseError}`);
      res.status(400).send();
  }}else {
    logger.error(`API Assignments - Request put - User ${userIdPut} is trying to update assignements for user ${assignment.accountId}. Action Forbidden`)
    res.status(403).send();
  }
}catch(error){
  logger.error(`API Assignments - Request put - bad request ${error}`)
  console.log(error)
  res.status(400).send();
}
}

const patchAssignmentwithId=(autheticate)=async(req,res)=>{
  //client.increment('patch-assignment')
  logger.error(`API Assignments - Request Patch - Method Not allowed `)
  return res.status(405).send();
}




module.exports={ getAssignemnts, postAssignemnts, getAssignment, deleteAssignments,patchAssignment, putAssignemnts, patchAssignmentwithId}

