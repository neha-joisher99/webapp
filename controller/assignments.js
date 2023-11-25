const express= require('express');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
const db = require('../models');
const logger=require('../logger/index.js')
const StatsD = require('node-statsd');

const AWS = require('aws-sdk');

// Configure AWS with your credentials and region
AWS.config.update({
  accessKeyId: 'YOUR_AWS_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_AWS_SECRET_ACCESS_KEY',
  region: 'YOUR_AWS_REGION'
});

const sns = new AWS.SNS();

const client = new StatsD({
  errorHandler: function (error) {
    logger.error("StatsD error: ", error); // Using logger instead of console.error
  }
});
client.socket.on('error', function(error) {
    logger.error("Error in socket: ", error); // Using logger instead of console.error
  });
  
const getAssignemnts = (autheticate)= async (req, res) =>{
  client.increment('getAll-assignment')
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
  client.increment('post-assignment')
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
   client.increment('delete-assignment')
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
  
      if (!assignment) {
              logger.info(`API Assignment - Request delete - Assignement ${assignment.id} not found!`)
              return res.status(404).json();
            }
        

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

  const deleteAssignmentsWithoutID=(autheticate)=async(req,res)=>{
      logger.error(`API Assignments - Request delete - Bad request - No Assignment ID specified in path paramter`);
      return res.status(400).send('No Assignment ID specified in path parameter');
  }


const getAssignment=(autheticate)=async(req,res)=>{
  client.increment('get-assignment')
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
  client.increment('patch-assignment')
  logger.error(`API Assignments - Request Patch - Method Not allowed `)
  return res.status(405).send();
}





const putAssignemnts=(autheticate)=async(req,res)=>{
 client.increment('put-assignment')
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



const putAssignmentsWithoutID=(autheticate)=async(req,res)=>{
  logger.error(`API Assignments - Request put - Bad request - No Assignment ID specified in path paramter`);
  return res.status(400).send('No Assignment ID specified in path parameter');
}

const patchAssignmentwithId=(autheticate)=async(req,res)=>{
  client.increment('patch-assignment')
  logger.error(`API Assignments - Request Patch - Method Not allowed `)
  return res.status(405).send();
}


const postAssignemntSubmission=(autheticate)=async(req,res)=>{
  console.log("IN submission")
  client.increment('post-assignment-Submission')
  const contentLength = req.get('Content-Length');
  const assignmentId= req.params.id;
  if (Object.keys(req.query).length > 0) {
    logger.error(`API Assignments - Request post Submission - Bad request query paramaters ${req.query}`);
    return res.status(400).send('Unexpected query parameters');
  }
  if (contentLength===0 || Object.keys(req.body).length === 0 || !req.body ){
    logger.error(`API Assignments - Request post Submission - Bad request - Empty Body`);
    return res.status(400).send('Request body is empty');
  }

  if ( !req.params.id ){
    logger.error(`API Assignments - Request post Submission - Bad request - No Assignment ID specified in path paramter`);
    return res.status(400).send('No Assignment ID specified in path parameter');
  }

  const {submission_url} = req.body
  const bodyKeys = Object.keys(req.body);

  if (bodyKeys.length !== 1 || !submission_url) {
    logger.error(`API Assignments - Request post - Submission - Bad request - Invalid request body`);
    return res.status(400).send('Request body must contain only the submission URL');
  }
  let assignment=null;
  console.log(req.params.id)
  //check if assignmenet does not exist
  try {

    console.log('in try')
     assignment = await db.assignments.findOne({
      where: { id: req.params.id }
    });
    console.log(assignment)

    if (assignment == null){
      logger.error(`API Assignment - Request post Submission - Assignement  ${req.params.id} not found!`)
      res.status(404).send(); 
    }
    console.log(assignment.accountId)
    console.log(req.user.id)
    if (assignment !== null) {
      if (assignment.accountId==req.user.id){
        console.log('inside loop')
        const currentDate = new Date();
        const deadline = new Date(assignment.deadline);

        const submissionsCount = await db.submission.count({
          where: { assignmentId: req.params.id }
        });

        console.log(submissionsCount)
        console.log(assignment.num_of_attempts)

        if (submissionsCount >= assignment.num_of_attempts) {
          logger.error(`API Assignment - Exceeded the number of submission attempts.`);
          return res.status(400).send('Exceeded the number of submission attempts');
        }

          if (currentDate > deadline) {
            logger.error(`API Assignment - Submission deadline has passed.`);
            return res.status(400).send('Submission deadline has passed');
          }
          const accountExists = await db.account.findByPk(req.user.id);
          if (!accountExists) {
            return res.status(404).send('Account does not exist');
          }

          const newSubmission = await db.submission.create({
            submission_url: req.body.submission_url,
            assignment_id: req.params.id,
            submission_date: currentDate.toISOString(),
            submission_updated: currentDate.toISOString(),
            assignmentId: req.params.id,
          });

          const reorderedAssignmentData = {
            id: newSubmission.id,
            assignment_id: newSubmission.assignmentId,
            submission_url: newSubmission.submission_url,
            submission_date: newSubmission.submission_date,
            submission_updated: newSubmission.submission_updated,
          };

            logger.info('API Assignments - Request post - Submission posted successfully!')
            res.status(201).json(reorderedAssignmentData);
            
            const message = {
              default: `New submission: ${newSubmission.submission_url}, User Email: ${req.user.email}`,
              email: `New submission: ${newSubmission.submission_url}, User Email: ${req.user.email}`
            };
        
            const params = {
              Message: JSON.stringify(message),
              TopicArn: process.env.TopicArn,
              MessageStructure: 'json'
            };
        
            sns.publish(params, (err, data) => {
              if (err) {
                console.error("Error publishing to SNS topic:", err);
                return res.status(500).send('Error in SNS publishing.');
              } else {
                console.log("Successfully published to SNS topic:", data);
                return res.status(200).send('Successfully published to SNS topic');
              }
            });

      }else {
        logger.error(`API Assignment - Request post Submission - User ${req.user.id} is trying to create a submission for user ${assignment.accountId}. Action Forbidden`)
        res.status(403).send()
      }
     } 
  } catch (SequelizeDatabaseError) {
    console.log(SequelizeDatabaseError)
  }
}  



const postAssignemntSubmissionWithoutID=(autheticate)=async(req,res)=>{
  logger.error(`API Assignments - Request post Submission - Bad request - No Assignment ID specified in path paramter`);
  return res.status(400).send('No Assignment ID specified in path parameter');
}




module.exports={ getAssignemnts, postAssignemnts, getAssignment, deleteAssignments,patchAssignment, putAssignemnts, patchAssignmentwithId, postAssignemntSubmission,deleteAssignmentsWithoutID, putAssignmentsWithoutID, postAssignemntSubmissionWithoutID}

