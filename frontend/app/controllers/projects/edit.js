import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        save() {
            this.model.save().then(function() {
                history.back();
            });
        },

        cancel() {
            this.get('model').rollbackAttributes();
            history.back();
        }
    }
});
