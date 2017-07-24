export default Ember.Route.extend({
    setupController(controller, model) {
        this._super(controller, model);
        this.controller.setProperties({isNew: false});
    },

    model(params) {
        return this.get('store').findRecord('project', params.id);
    },

    actions: {
        willTransition() {
            console.log('Transition');
            let model = this.controller.get('model');
            model.rollbackAttributes();
        }
    }
});
