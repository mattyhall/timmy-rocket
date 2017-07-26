import Ember from 'ember';

export default Ember.Route.extend({

    setupController(controller, model) {
        this._super(controller, model);
        this.controller.setProperties({isNew: false, showProjects: false});
    },

    model(params) {
        return this.get('store').findRecord('activity', params.id);
    },

    actions: {
        willTransition() {
            let model = this.controller.get('model');
            model.rollbackAttributes();
        }
    }
});
