import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    showErrors: false,

    actions: {
        authenticate: function() {
            var credentials = this.getProperties('identification', 'password'),
                authenticator = 'authenticator:token';
            if (!credentials.identification || !credentials.password) {
                return;
            }
            var t = this;
            this.get('session').authenticate(authenticator, credentials)
                .then(() => t.transitionToRoute('projects'))
                .catch(() => t.set('showErrors', true));
        }
    }
});
