import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
    clock: Ember.inject.service('a-clock'),
    timing: false,
    start_time: null,
    diff: Ember.computed('start_time', 'clock.time', function() {
        let st = this.get('start_time');
        if (st !== null) {
            var duration = moment.now() - st;
            var d = moment.utc(moment.duration(duration).asMilliseconds());
            return d.format('H:mm:ss');
        }
        return '';
    }),

    init() {
        this.get('clock').start();
    },

    actions: {
        start() {
            this.set('timing', true);
            this.set('start_time', moment.now());
        }
    }
});
