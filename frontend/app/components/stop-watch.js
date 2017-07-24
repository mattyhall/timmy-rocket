import Ember from 'ember';

export default Ember.Component.extend({
    seconds_deg: Ember.computed('seconds', function() {
        let degrees = 360/60 * this.get('seconds');
        return Ember.String.htmlSafe('transform: rotate(' + degrees + 'deg);');
    }),

    minutes_deg: Ember.computed('minutes', function() {
        let degrees = 360/60 * this.get('minutes');
        return Ember.String.htmlSafe('transform: rotate(' + degrees + 'deg);');
    })
});
