import Ember from 'ember';

export default Ember.Controller.extend({
    isNew: false,
    showProjects: false,
    proj_id: null,
    showErrors: false,

    projects: Ember.computed('store', function() {
        this.get('store').findAll('project').then((projects) => {
            this.set('projects', projects);
            this.set('proj_id', projects.get('firstObject.id'));
        });
    }),

    actions: {
        save() {
            if (!this.get('model.validations.isValid')) {
                this.set('showErrors', true);
                return;
            }
            if (this.get('showProjects')) {
                var proj_id = this.get('proj_id');
                this.get('projects').forEach((proj) => {
                    if (proj.id == proj_id) {
                        this.set('model.project', proj);
                        return false;
                    }
                });
            }
            this.get('model').save()
                .then(() => history.back());
        },

        cancel() {
            history.back();
        }
    }
});
