import Ember from 'ember';

export default Ember.Controller.extend({
    errors: null,
    isNew: false,
    showErrors: false,

    actions: {
        save() {
            if (!this.get('model.validations.isValid')) {
                this.set('showErrors', true);
                return;
            }
            this.model.save().then(function() {
                history.back();
            });
        },

        cancel() {
            history.back();
        }
    }
});
