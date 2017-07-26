import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
    tagName: '',
    changed: false,
    shouldShow: computed.or('changed', 'show'),

    actions: {
        change() {
            this.set('changed', true);
        }
    }
});
