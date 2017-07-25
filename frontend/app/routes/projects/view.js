export default Ember.Route.extend({
    model(params) {
        return this.get('store').findRecord('project', params.id);
    },

    actions: {
        didTransition() {
            this.set('controller.refresh', !this.get('controller.refresh'));
        }
    }
});
