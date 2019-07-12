var util = {}

let savedTasks = [{
    
}]

util.getTasks(query) {
    if (query.keyword) {
        return savedTasks.filter(x=>{
        })
    }
}

module.exports = util;