import Ember from 'ember';
import moment from 'moment';
import {formatTimedifference} from 'frontend/helpers/format-timedifference';

export default Ember.Controller.extend({
    // refresh is toggled when we come back from editing activities, so the
    // changes are reflected in the list. See router.willTransition
    refresh: true,

    tags: Ember.computed('refresh', 'model.activities', function() {
        var labels = [],
            counts = [];
        this.get('model.activities').forEach((act) => {
            var s = act.get('start_time'),
                e = act.get('end_time');
            act.get('tags').forEach((tag) => {
                if (tag == "") {
                    return;
                }
                var i = labels.indexOf(tag);
                if (i == -1) {
                    labels.push(tag);
                    counts.push(0);
                    i = labels.length - 1;
                }
                var diff = moment(e) - moment(s);
                counts[i] += moment.duration(diff).asMilliseconds();
            });
        });
        var data = counts.map((n) => n / 1000 / 60 / 60),
            colours = labels.map((_) => '#5ab0ee');
        return {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colours
            }]
        };
    }),

    hours: Ember.computed('refresh', 'model.activities', function() {
        var labels = [],
            counts = [];
        for (var i=0; i<24; i++) {
            var s = '';
            if (i < 10) { s += '0'; }
            labels.push(s + i);
            counts.push(0);
        }
        this.get('model.activities').forEach((act) => {
            var s = moment(act.get('start_time')),
                e = moment(act.get('end_time')),
                sh = s.format('HH'),
                eh = e.format('HH');
            var run = true;
            while (run) {
                var end_of_hour = moment(s).endOf('hour');
                if (end_of_hour > e) {
                    end_of_hour = e;
                    run = false;
                }
                var i = labels.indexOf(s.format('HH'));
                counts[i] += moment.duration(end_of_hour - s).asMilliseconds();
                s = end_of_hour.add(1, 'second');
            }
        });
        var data = counts.map((n) => n / 1000 / 60 / 60),
            colours = labels.map((_) => '#5ab0ee');
        return {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colours
            }]
        };
    }),

    days: Ember.computed('refresh', 'model.activities', function() {
        var labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            counts = [0, 0, 0, 0, 0, 0, 0];
        this.get('model.activities').forEach((act) => {
            var s = moment(act.get('start_time')),
                e = moment(act.get('end_time')),
                sd = s.format('ddd'),
                ed = e.format('ddd');
            if (sd != ed) {
                var middle = e.clone().startOf('day');
                var i = labels.indexOf(sd);
                counts[i] += moment.duration(middle - s).asMilliseconds();
                i = labels.indexOf(ed);
                counts[i] += moment.duration(e - middle).asMilliseconds();
            } else {
                var i =labels.indexOf(sd);
                counts[i] += moment.duration(e - s).asMilliseconds();
            }
        });
        var data = counts.map((n) => n / 1000 / 60 / 60),
            colours = labels.map((_) => '#5ab0ee');
        return {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colours
            }]
        };
    }),

    ganttx: {datasets: [
        {
            backgroundColor: '#5ab0ee',
            borderColor: '#5ab0ee',
            fill: false,
            borderWidth: 15,
            pointRadius: 0,
            data: [{x: 0, y: 5}, {x: 3, y: 5}]
        }
    ]},

    gantt: Ember.computed('model.activities', 'refresh', function() {
        let start_of_week = moment().startOf('isoweek');
        let end_of_week = moment().endOf('isoweek');
        let data = [];
        let bar = (_) => { return {
        };};
        let f = (s, e) => {
            let d = s.day();
            if (s.day() == 0) {
                d = 7;
            }
            return {
                backgroundColor: '#5ab0ee',
                borderColor: '#5ab0ee',
                fill: false,
                borderWidth: 25,
                pointRadius: 0,
                label: `${s.format("HH:mm:ss")}-${e.format("HH:mm:ss")}`,
                data: [{x: s.hour() + s.minute()/60, y: d},
                       {x: e.hour() + e.minute()/60, y: d}]
            };
        };
        let activities = this.get('model.activities').filter((act) => {
            let s = moment(act.get('start_time'));
            return s.isAfter(start_of_week) && s.isBefore(end_of_week);
        }).forEach((act) => {
            let s = moment(act.get('start_time')),
                e = moment(act.get('end_time')),
                sd = s.format('d'),
                ed = e.format('d');
            if (sd != ed) {
                let new_s = moment(s).clone();
                let new_e = moment(e).clone();
                data.push(f(s, new_s.endOf('day')));
                data.push(f(new_e.startOf('day'), e));
            } else {
                data.push(f(s, e));
            }
        });
        console.dir(data);
        return {datasets: data};
    }),

    gantt_options: {
        legend: {display: false},
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 8,
                    autoSkip: false,

                    callback: (val, ind, vals) => {
                        if (val <= 0 || val >= 8) {
                            return ''
                        }
                        var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                        return days[val-1];
                    }
                }
            }],
            xAxes: [{
                type: 'linear',
                ticks: {
                    autoSkip: true,
                    autoSkipPadding: 20,
                    min: 0,
                    max: 24,
                    beginAtZero: true,
                    stepSize: 1
                }
            }]
        },
        maintainAspectRatio: false,
    },

    options: {
        legend: { display: false },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: 'hours',
                }
            }],
            xAxes: [{
                ticks: {
                    autoSkip: false
                }
            }]
        },
    }
});
