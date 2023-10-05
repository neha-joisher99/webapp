const express= require('express');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
const db = require('../models');


const getAssignemnts = (autheticate)= async (req, res) =>{
    try{
      const contentLength = req.get('Content-Length');
      console.log(contentLength)
      console.log('In get')
      console.log(req.query)
      console.log(req.body)

          if (Object.keys(req.query).length > 0) {
            console.log('in nnnnn')
            return res.status(400).send();
          }
          if (contentLength>0 ){
            console.log('in sbqwjbsjkn')
            return res.status(400).send();
          }
          else {
            const assignments = await db.assignments.findAll({
                attributes: [
                  'id',  'name', 'points', 'num_of_attempts',  'deadline',  'assignment_created', 'assignment_updated',
                ],
              });
              res.status(200).json(assignments);
            }
    } catch (error) {
              console.error(error);
              res.status(400).send();
            }
}

const postAssignemnts=(authenticate)= async(req,res)=>{ 
  console.log(req.query)
  console.log(req.body)
  console.log(!req.body)
  console.log(req.query)
  // if (!req.body || req.query) {
  //   return res.status(400).send();
  // }
  const contentLength = req.get('Content-Length');
  if (Object.keys(req.query).length > 0) {
    console.log('in nnnnn')
    return res.status(400).send();
  }
  if (contentLength===0 ){
    console.log('in sbqwjbsjkn')
    return res.status(400).send();
  }

  console.log('In post')
  const { name, points, num_of_attempts, deadline, assignment_created, assignment_updated } = req.body
    try {
            console.log('in here')
            console.log(req.body);
            const { name, points, num_of_attempts, deadline } = req.body
             
            if (!name || points === undefined || points < 1 || points > 10 || num_of_attempts === undefined || num_of_attempts < 1 || !deadline) {
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
        
            res.status(201).json(reorderedAssignmentData);

            } catch (error) {
              console.error(error);
              res.status(400).send();
            }
  }


  const deleteAssignments=(autheticate)=async(req,res)=>{
    console.log('in delete')
    console.log(req.query)
    console.log(req.body)

        // if (req.body || !req.query) {
        //   return res.status(400).send();
        // }

        const contentLength = req.get('Content-Length');
        // if (Object.keys(req.query).length === 0) {
        //   console.log('in nnnnn')
        //   return res.status(400).send();
        // }
        if (contentLength>0 ){
          console.log('in sbqwjbsjkn')
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
            res.status(204).send(); 
        }else {
          res.status(403).send()
        }
      } else {
        res.status(404).send(); 
      }
    } catch (error) {
     console.log(error)
    }
  }  


const getAssignment=(autheticate)=async(req,res)=>{
  console.log('in get:id')

  console.log(req.query)
  console.log(req.body)

  const contentLength = req.get('Content-Length');
 
  if (contentLength>0 ){
    console.log('in sbqwjbsjkn')
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


    res.status(200).json(reorderedAssignmentDataGet);
  }catch (error) {
    console.error(error);
    res.status(400).send();
  }
}

const patchAssignment=(autheticate)=async(req,res)=>{
  return res.status(405).send();
}





const putAssignemnts=(autheticate)=async(req,res)=>{
  console.log('In put')
  const assignmentIdPUT = req.params.id;   // assignment-id from paramaters
  console.log('assignmentIdPUT :', assignmentIdPUT)
  const userIdPut=  req.user.id            //user-id doing the operation
  console.log('userIdPut :' , userIdPut)
  const updatedAssignmentData = req.body;
  console.log('updatedAssignmentData :' , updatedAssignmentData)

  if (Object.keys(req.query).length > 0) {
    console.log('in query')
    return res.status(400).send();
  }

  const contentLength = req.get('Content-Length');
  if (contentLength==0 ){
    console.log('in contentLength')
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
      return res.status(404).send();
    }
      if (assignment.accountId==userIdPut){
  // Validate the request body
  if (
    typeof updatedAssignmentData.name !== 'string' || typeof updatedAssignmentData.points !== 'number' ||
    typeof updatedAssignmentData.num_of_attempts !== 'number' || typeof updatedAssignmentData.deadline !== 'string'
  ) { return res.status(400).send() }

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
    res.status(204).send();
  }catch(error){
      console.log('error while saving to database',err)
  }}else {
    res.status(403).send();
  }
}catch(error){
  console.log(error)
}
}


module.exports={ getAssignemnts, postAssignemnts, getAssignment, deleteAssignments,patchAssignment, putAssignemnts}

