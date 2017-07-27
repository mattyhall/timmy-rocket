export default Ember.Route.extend({
    model(params) {
        return this.get('store').findRecord('project', params.id);
    }
});
