import Ember from 'ember';

export default Ember.Component.extend({
    confirmation: false,

    actions: {
        confirm() {
            this.set('confirmation', !this.get('confirmation'));
        },
        delete() {
            this.get('delete')();
        }
    }
});
