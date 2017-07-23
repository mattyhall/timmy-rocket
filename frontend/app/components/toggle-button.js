import Ember from 'ember';

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
    },

    actions: {
        toggle() {
            let new_val = !this.get('toggled');
            this.set('toggled', new_val);
            this.get('act')();
        }
    }
});
