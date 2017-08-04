# timmy-rocket
A timesheets app written in ember with a rust backend.

![Image of timmy](http://mattyhall.github.io/static/pics/projects/timmy.png)

Written after [timmy](https://github.com/mattyhall/timmy) my command line timesheets program, stopped compiling for some reason. 

The backend is written using [rocket](http://rocket.rs/) and is backed by a PostgreSQL database.

Its features include:

* Creating projects
* Timing "activities" using a stopwatch
* Adding previous activities using human dates (eg. "two hours ago")
* Visualising the information, such as hours spent on each day of the week or each hour of the day, most common tags and a gantt chart (done using Chart.js)
* User authentication
* Responsive design
