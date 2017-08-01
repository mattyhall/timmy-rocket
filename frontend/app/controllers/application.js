import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),

    actions: {
        invalidate() {
            var t = this;
            this.get('session').invalidate().then(() => this.transitionToRoute('login'));
        }
    }
});
