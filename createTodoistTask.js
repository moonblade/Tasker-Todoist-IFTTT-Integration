
input = [{"type": "item_add", "args": {"content": "%taskTitle", "due": "%taskTime"}}]
input = [{"type": "item_add", "args": {"content": "test", "due": "10 PM"}}]

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