var express = require('express');
const fetch = require('node-fetch');
var router = express.Router();
const debug = require('debug')('index')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

function callAPI(body = {}, token = "00aee294bc9798d251cbbbe9d0f245451794aca6") {
  body.token = token;
  return fetch("https://todoist.com/api/v8/sync", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
  }).then(response=> {
      if (response.ok)
          return response.json()
      else
          throw new Error(response.status + " " + JSON.stringify(response))
  }).then(result=>{
      return result
  }).catch(error=>{
      throw error
  });
}

function createTask(taskTitle, taskTime, projectId) {
  commands = [{"type": "item_add", "args": {"content": taskTitle, "due": { "string": taskTime, "lang": "en" }, "project_id": projectId }, "uuid":uuid(), "temp_id":uuid()}];
  debug(commands)
  return callAPI({commands})
}

function getProjects() {
  return callAPI({resource_types: ["projects"]})
}

function getItems() {
  return callAPI({resource_types: ["items"]})
}

function getProjectId(projectName = "Personal") {
  return getProjects().then(result=>{
    let projectId = null;
    result.projects.forEach(project=>{
      if (project.name.toLowerCase() == projectName.toLowerCase()) {
        projectId = project.id;
        return false;
      }
    });
    return projectId;
  });
}

/**
 * @api {put} /task add new task
 * @apiDescription add new task to the project given in body
 * @apiGroup task
 * 
 * @apiParam {string} tastTitle title of the task to add
 * @apiParam {string} taskTime human readable due date for the task
 * @apiParam {string} projectName project under which task is to be added, default - Personal
 * 
 * @apiSuccess {object} created task details
 * @apiVersion 1.0.0
 */
router.put('/task', (req, res, next)=> {
  getProjectId(req.body.projectName)
  .then(projectId=>{
    debug(projectId)
    return createTask(req.body.taskTitle, req.body.taskTime, projectId);
  }).then(result=>{
    res.json(result);
  }).catch(error=>{
    res.status(500).json(error);
  });
});

/**
 * @api {delete} /task delete task
 * @apiDescription delete tasks that are overdue, ie due date is earlier than yesterday
 * @apiGroup task
 * 
 * @apiParam {string} projectName project under which task is to be added, default - Personal
 * 
 * @apiSuccess {object} delete task details
 * @apiVersion 1.0.0
 */
router.delete('/task', (req, res, next)=> {
  let projectId = null;
  getProjectId(req.body.projectName).then(mProjectId=>{
    projectId = mProjectId;
    return getItems();
  }).then(result=>{
    let toDelete = []
    result.items.forEach(item=>{
      var date = new Date();
      date.setDate(date.getDate() - 1);
      if (item.project_id == projectId && item.due && !item.due.is_recurring && (new Date(item.due.date))<date) {
        toDelete.push(item.id)
      }
    });
    return toDelete;
  }).then(toDelete=>{
    return toDelete.map(id=>{
      return {"type": "item_delete", "uuid": uuid(), "args": {"id": id}}
    });
  }).then(req=>{
    return callAPI({commands:req});
  }).then(result=>{
    res.json(result);
  }).catch(error=>{
    res.status(500).json(error);
  })
});
module.exports = router;
