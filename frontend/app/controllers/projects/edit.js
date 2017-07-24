import Ember from 'ember';

export default Ember.Controller.extend({
    errors: null,
    isNew: false,
    actions: {
        save() {
            let t = this;
            this.model.save().then(function() {
                t.set('errors', null);
                history.back();
            }, function(error) {
                t.set('errors', {title: []});
                let errors = t.get('model.errors');
                for (var error of errors.get('title')) {
                    t.get('errors.title').push(error.message);
                }
            });
        },

        cancel() {
            this.set('errors', null);
            history.back();
        }
    }
});
