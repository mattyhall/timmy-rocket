export default Ember.Route.extend({
    queryParams: {
        start_time: '',
        end_time: '',
        showProjects: false,
    },

    setupController: function(controller, model, transition) {
        let params = transition.queryParams;
        let showProjects = params.showProjects == 'true';
        this.controllerFor('projects.activities.edit').setProperties({isNew: true, model: model, showProjects: showProjects});
    },

    renderTemplate: function() {
        this.render('projects/activities/edit');
    },

    model(params) {
        let data = {tags: []};
        if ("start_time" in params) {
            data.start_time = params.start_time;
        }
        if ("end_time" in params) {
            data.end_time = params.end_time;
        }
        return this.get('store').createRecord('activity', data);
    },

    actions: {
        willTransition() {
            let model = this.controllerFor('projects.activities.edit').get('model');
            if (model.get('isNew')) {
                model.deleteRecord();
            }
        }
    }
});
