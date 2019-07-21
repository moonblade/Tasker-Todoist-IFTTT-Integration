# taskerTasks
Heroku server to ping requests off of for creating todoist tasks from tasker automation for android.

Currently set up so as to add a todoist task on api call (as ifttt webhook integration was not behaving correctly all the time)

Plans to update include adding tags which would create tasks in groups, eg: the tag morning would add all tasks to be done in the morning.

Added provision to delete all pending tasks in personal project so as to not clog the system with repetitive tasks if ignored. This is called from ifttt every day at 11.30 pm.
