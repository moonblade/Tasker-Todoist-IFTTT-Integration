const _ = require('lodash')
const debug = require('debug')('util')
let savedTasks = require('./savedTasks')
let tags = require('./tags')
let condition = require('./condition')
var util = {}

util.cleanQuery = function(query) {
    if (query.tags && !_.isArray(query.tags)) {
        query.tags = [query.tags]
        _.each(query.tags, x=>{
            x = tags[x]
        })
    }
    query.condition = condition[query.condition] || condition.OR
    return query;
}
util.getTasks = function(query) {
    query = util.cleanQuery(query);
    let tasks = []
    if (query.tags) {
        tasks = _.filter(savedTasks, x=>{
            if (query.condition == condition.OR) {
                return _.size(_.intersection(query.tags, x.tags)) > 0
            } else if (query.condition == condition.AND) {
                return _.size(_.intersection(query.tags, x.tags)) == _.size(query.tags)
            }
        })
    }
    return tasks;
}

module.exports = util;