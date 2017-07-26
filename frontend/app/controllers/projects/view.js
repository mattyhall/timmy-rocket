import Ember from 'ember';
import moment from 'moment';
import {formatTimedifference} from 'frontend/helpers/format-timedifference';

export default Ember.Controller.extend({
    // refresh is toggled when we come back from editing activities, so the
    // changes are reflected in the list. See router.willTransition
    refresh: true,
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
            this.transitionToRoute('projects.activities.new')
                .then((route) => {
                    route.currentModel.set('project', proj);
                    route.controller.set('showProjects', false);
                });
        }
    }
});
