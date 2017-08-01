import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),

    actions: {
        authenticate: function() {
            var credentials = this.getProperties('identification', 'password'),
                authenticator = 'authenticator:token';
            console.dir(history.state);
            var t = this;
            this.get('session').authenticate(authenticator, credentials)
                .then(() => t.transitionToRoute('projects'));
        }
    }
});
