export default Ember.Route.extend({
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
