import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        didTransition() {
            this.controller.filter();
            return true;
        }
    }
});
