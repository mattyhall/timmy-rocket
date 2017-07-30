import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['chart-container'],

    tags: Ember.computed('activities.@each.{readFlag}', function() {
        var labels = [],
            counts = [];
        this.get('activities').forEach((act) => {
            var s = act.get('start_time'),
                e = act.get('end_time');
            act.get('tags').forEach((tag) => {
                if (tag == "") {
                    return;
                }
                var i = labels.indexOf(tag);
                if (i == -1) {
                    labels.push(tag);
                    counts.push(0);
                    i = labels.length - 1;
                }
                var diff = moment(e) - moment(s);
                counts[i] += moment.duration(diff).asMilliseconds();
            });
        });
        var data = counts.map((n) => n / 1000 / 60 / 60),
            colours = labels.map((_) => '#5ab0ee');
        labels = labels.map((tag) => tag.split(' '));
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
