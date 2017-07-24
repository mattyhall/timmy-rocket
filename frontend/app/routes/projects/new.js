export default Ember.Route.extend({
    setupController: function(controller, model) {
        this.controllerFor('projects.edit').setProperties({isNew: true, model: model});
    },

    renderTemplate: function() {
        this.render('projects/edit');
    },

    model() {
        return this.get('store').createRecord('project', {active: true});
    }
});
