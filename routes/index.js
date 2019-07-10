var express = require('express');
const fetch = require('node-fetch');
var router = express.Router();

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

function createTask(taskTitle, taskTime, token = "00aee294bc9798d251cbbbe9d0f245451794aca6") {
  commands = [{"type": "item_add", "args": {"content": taskTitle, "due": { "string": taskTime, "lang": "en" } }, "uuid":uuid(), "temp_id":uuid()}];
  return fetch("https://todoist.com/api/v8/sync", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          commands: commands,
          token: token
      })
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


router.post('/createTask', (req, res, next)=> {
  createTask(req.body.taskTitle, req.body.taskTime, req.body.token).then(result=>{
    res.json(result);
  }).catch(error=>{
    res.status(500).json(error);
  });
});
module.exports = router;
