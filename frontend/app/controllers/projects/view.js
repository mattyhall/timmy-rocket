import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
    table: Ember.computed('model.activities', function() {
        var last_day = null;
        var table = [];
        this.get('model.activities').forEach(function(act) {
            let s = moment(act.get('start_time')),
                e = moment(act.get('end_time'));
            var row = {
                day: s.format('ddd DD MMMM'),
                description: act.get('description'),
                start: s,
                end: e,
                model: act
            };
            let day = moment(act.get('start_time')).format('LL');
            if (day == last_day) {
                row.day = "";
            }
            last_day = day;
            table.push(row);
        });
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
        }
    }
});
