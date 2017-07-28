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
                var middle = e.startOf('day');
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
        }
    },

    table: Ember.computed('refresh', 'model.activities', function() {
        var last_day = null;
        var first = true;
        var table = [];
        var total = 0;
        this.get('model.activities').forEach(function(act) {
            let s = moment(act.get('start_time')),
                e = moment(act.get('end_time')),
                duration = moment(e) - moment(s),
                milli = moment.duration(duration).asMilliseconds(),
                diff = moment.utc(milli);
            var row = {
                start: s,
                end: e,
                day: s.format('ddd DD MMMM'),
                description: act.get('description'),
                diff: diff,
                model: act,
                type: 'normal',
                tags: act.get('tags').join(', ')
            };
            let day = s.format('LL');
            total += milli;
            if (day == last_day) {
                row.day = "";
            } else if (!first) {
                total -= milli;
                let total_diff = moment.utc(total);
                let text = formatTimedifference([total_diff]);
                table.push({type: 'total', time: text});
                total = milli;
            }
            last_day = day;
            table.push(row);
            first = false;
        });
        let total_diff = moment.utc(total);
        let text = formatTimedifference([total_diff]);
        table.push({type: 'total', time: text});
        return table;
    })
});