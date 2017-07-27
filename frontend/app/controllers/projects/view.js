import Ember from 'ember';
import moment from 'moment';
import {formatTimedifference} from 'frontend/helpers/format-timedifference';

export default Ember.Controller.extend({
    // refresh is toggled when we come back from editing activities, so the
    // changes are reflected in the list. See router.willTransition
    refresh: true,

    count_time(activities) {
        let total = 0;
        activities.forEach((act) => {
            let duration = moment(act.get('end_time')) - moment(act.get('start_time'));
            total += moment.duration(duration);
        });
        return moment.utc(total);
    },

    hours_total: Ember.computed('refresh', 'model.activities', function() {
        return this.count_time(this.get('model.activities'));
    }),

    this_week_hours_total: Ember.computed('refresh', 'model.activities', function() {
        let start_of_week = moment().startOf('isoweek');
        let end_of_week = moment().endOf('isoweek');
        let activities = this.get('model.activities').filter((act) => {
            let s = moment(act.get('start_time'));
            return s.isAfter(start_of_week) && s.isBefore(end_of_week);
        });
        return this.count_time(activities);
    }),

    tags: {
        labels: ['frontend', 'backend'],
        datasets: [{data: [10, 20], backgroundColor: ['green', 'blue']}]
    },

    options: {
        legend: { display: false },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
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
    }),

    actions: {
        delete() {
            var model = this.get('model');
            model.deleteRecord();
            model.save().then(function() {
                history.back();
            });
        },

        delete_activity(model) {
        },

        create_activity() {
            let proj = this.get('model');
            this.transitionToRoute('projects.activities.new', {queryParams: {
                showProjects: false,
                start_time: '',
                end_time: ''
            }}).then((route) => {
                route.currentModel.set('project', proj);
            });
        }
    }
});
