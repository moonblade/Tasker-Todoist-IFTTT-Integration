Date.prototype.toIsoString = function() {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
}

setGlobal = function(string) {}
flash = function(string) {
    console.log(string)
}
global = function(string) {
    a = {
        prevActivity: "gym",
        prevStartTime: 1562328476,
        startTime: 1562334676,
        workspaceId: 3376918,
    }
    return a[string]
}

let prevActivity = global("prevActivity")
let isoDate = new Date(parseInt(global('%prevStartTime'))*1000).toIsoString();
let duration = Math.floor((global("startTime") - global("prevStartTime")));
var request_body = {
    time_entry: {
        description: prevActivity,
        tags: [prevActivity],
        start: isoDate,
        created_with: "Tasker",
        duration: duration,
        pid: 152136871
    }
}

// setGlobal('requestBody',(JSON.stringify(request_body)))
var headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa("226157ab6eb3dc421018671323209cd3" + ":" + "api_token")
};

function addTime() {
    fetch("https://www.toggl.com/api/v8/time_entries", {
        method: "POST",
        headers,
        body: JSON.stringify(request_body)
    }).then(response=> {
        if (response.ok)
            return response.json()
        else
            throw new Error(response.status + " ")
    }).then(()=>{
        exit()
    }).catch(error=>{
        // console.log(error)
        flash("Error time : " + error)
    });
}
fetch("https://www.toggl.com/api/v8/workspaces/"+global("workspaceId")+"/projects", {
    method: "GET",
    headers,
}).then(response=>response.text())
.then(response=>{
    setGlobal('compareT1', response||"kjh")
    response = JSON.parse(response || "")
    let found = false;
        if (response) 
        response.forEach(project => {
            // setGlobal('compareT1', global('compareT1') + " " + project.name.toLowerCase() + " " + prevActivity.toLowerCase())
            if(project.name.toLowerCase() == prevActivity.toLowerCase()) {
                request_body.time_entry.pid = project.id
                found = true
            }
        });
    if (found) {
        addTime()
    } else {
        fetch("https://www.toggl.com/api/v8/projects", {
            method: "POST",
            headers,
            body: JSON.stringify({"project": {"name": prevActivity}})
        }).then(response=> {
            if (response.ok)
                return response.json()
            else
                throw new Error(response.status + " ")
            }).then(project=>{
                request_body.time_entry.pid = project.data.id
                addTime()
             }).catch(error=>{
                flash("Error add: " + error)
            });
        }
    }).catch(error=>{
         flash("Error projects: " + error)
    })