import Ember from 'ember';
import moment from 'moment';
import {formatTimedifference} from 'frontend/helpers/format-timedifference';

export default Ember.Controller.extend({
    // refresh is toggled when we come back from editing activities, so the
    // changes are reflected in the list. See router.willTransition
    refresh: true,

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
    })
});
