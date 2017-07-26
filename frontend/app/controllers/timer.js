import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
    clock: Ember.inject.service('a-clock'),
    state: 'initial',
    start_time: null,
    end_time: null,
    diff: Ember.computed('start_time', 'end_time', 'clock.time', function() {
        let st = this.get('start_time');
        let et = this.get('end_time');
        let state = this.get('state');
        var duration = 0;
        if (state == 'initial') {
            return null;
        } else if (state == 'timing') {
            duration = moment.now() - st;
        } else {
            duration = et - st;
        }
        var d = moment.utc(moment.duration(duration).asMilliseconds());
        return d;
    }),

    hours: Ember.computed('diff', function() {
        if (!this.get('diff')) {
            return '0';
        }
        return this.get('diff').format('H');
    }),

    minutes: Ember.computed('diff', function() {
        if (!this.get('diff')) {
            return '00';
        }
        return this.get('diff').format('mm');
    }),

    seconds: Ember.computed('diff', function() {
        if (!this.get('diff')) {
            return '00';
        }
        return this.get('diff').format('ss');
    }),

    init() {
        this.get('clock').start();
    },

    actions: {
        start() {
            this.set('state', 'timing');
            this.set('start_time', moment.now());
        },

        stop() {
            this.set('state', 'stopped');
            this.set('end_time', moment.now());
        },

        record() {
            let s = moment(this.get('start_time')).format('YYYY-MM-DDTHH:mm:ss');
            let e = moment(this.get('end_time')).format('YYYY-MM-DDTHH:mm:ss');
            this.transitionToRoute('projects.activities.new', {queryParams: {
                start_time: s,
                end_time: e,
                showProjects: true
            }});
        },

        restart() {
            this.set('state', 'initial');
            this.set('start_time', null);
            this.set('end_time', null);
        }
    }
});
