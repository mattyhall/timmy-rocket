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

    table: Ember.computed('refresh', 'model.activities', function() {
        var last_day = null;
        var table = [];
        var day_record = {rows: []};
        var total = 0;
        if (this.get('model.activities.length') == 0) {
            return [];
        }
        this.get('model.activities').forEach(function(act) {
            let s = moment(act.get('start_time')),
                e = moment(act.get('end_time')),
                duration = moment(e) - moment(s),
                milli = moment.duration(duration).asMilliseconds(),
                diff = moment.utc(milli),
                tags = act.get('tags');
            if (!tags) {
                tags = [];
            }
            var row = {
                start: s,
                end: e,
                description: act.get('description'),
                diff: diff,
                model: act,
                tags: tags.join(', ')
            };
            let day = s.format('LL');
            total += milli;
            if (day == last_day || last_day === null) {
                day_record.rows.push(row);
                day_record.day = day;
            } else {
                total -= milli;
                let total_diff = moment.utc(total);
                let text = formatTimedifference([total_diff]);
                day_record.total = text;
                table.push(day_record);
                day_record = {rows: []};
                day_record.rows.push(row);
                total = milli;
            }
            last_day = day;
        });
        let total_diff = moment.utc(total);
        let text = formatTimedifference([total_diff]);
        day_record.total = text;
        table.push(day_record);
        return table;
    }),

    actions: {
        delete_activity(model) {
            model.deleteRecord();
            var t = this;
            model.save().then(() => t.set('refresh', !t.get('refresh')));
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
