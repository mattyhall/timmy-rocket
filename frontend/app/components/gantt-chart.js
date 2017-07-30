import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
    refresh: false,
    start: moment().startOf('isoweek'),
    start_date: Ember.computed('start', 'refresh', function() {
        return this.get('start').format('DD MMM YYYY');
    }),

    gantt: Ember.computed('start', 'refresh', 'activities.@each.{readFlag}', function() {
        let start_of_week = this.get('start');
        let end_of_week = start_of_week.clone().endOf('isoweek');
        let data = [];
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
        let activities = this.get('activities').filter((act) => {
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
                            return '';
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
        maintainAspectRatio: false
    },

    actions: {
        change(amnt) {
            this.set('start', this.get('start').add(amnt, 'week'));
            this.set('refresh', !this.get('refresh'));
        }
    }
});
