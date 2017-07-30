import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['chart-container'],

    days: Ember.computed('activities.@each.{readFlag}', function() {
        var labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            counts = [0, 0, 0, 0, 0, 0, 0];
        this.get('activities').forEach((act) => {
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
                    labelString: 'hours'
                }
            }],
            xAxes: [{
                ticks: {
                    autoSkip: false
                }
            }]
        }
    }
});
