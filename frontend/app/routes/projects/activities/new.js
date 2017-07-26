export default Ember.Route.extend({
    setupController: function(controller, model) {
        this.controllerFor('projects.activities.edit').setProperties({isNew: true, model: model});
    },

    renderTemplate: function() {
        this.render('projects/activities/edit');
    },

    model() {
        return this.get('store').createRecord('activity', {tags: []});
    },

    actions: {
        willTransition() {
            let model = this.controllerFor('projects.activities.edit').get('model');
            model.deleteRecord();
        }
    }
});
