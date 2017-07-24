import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
    clock: Ember.inject.service('a-clock'),
    initial: true,
    start_time: null,
    diff: Ember.computed('start_time', 'clock.time', function() {
        let st = this.get('start_time');
        if (st !== null) {
            var duration = moment.now() - st;
            var d = moment.utc(moment.duration(duration).asMilliseconds());
            return d;
        }
        return null;
    }),

    hours: Ember.computed('diff', function() {
        if (!this.get('diff')) {
            return 0;
        }
        return this.get('diff').format('H');
    }),

    minutes: Ember.computed('diff', function() {
        if (!this.get('diff')) {
            return 0;
        }
        return this.get('diff').format('mm');
    }),

    seconds: Ember.computed('diff', function() {
        if (!this.get('diff')) {
            return 0;
        }
        return this.get('diff').format('ss');
    }),

    init() {
        this.get('clock').start();
    },

    actions: {
        start() {
            this.set('initial', false);
            this.set('start_time', moment(moment.now()).subtract(1.2, 'hour'));
        }
    }
});
