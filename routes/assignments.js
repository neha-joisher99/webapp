const express= require('express');
var router = express.Router();
const authenticate=require('../validateUser')
const controller = require('../controller/assignments.js')


router.get('',authenticate,controller.getAssignemnts);
router.post('',authenticate, controller.postAssignemnts);
router.put('/:id',authenticate,controller.putAssignemnts);
router.put('/',authenticate,controller.putAssignmentsWithoutID);
router.get('/:id',authenticate,controller.getAssignment);
router.patch('',authenticate, controller.patchAssignment);
router.patch('/:id',authenticate, controller.patchAssignmentwithId);
router.delete('/:id',authenticate,controller.deleteAssignments);
router.delete('/',authenticate,controller.deleteAssignmentsWithoutID);
router.post('/:id/submission', authenticate, controller.postAssignemntSubmission);
router.post('/submission', authenticate, controller.postAssignemntSubmissionWithoutID);



module.exports = router;