import Ember from 'ember';

export default Ember.Controller.extend({
    errors: null,
    isNew: false,
    actions: {
        save() {
            this.get('model').save()
                .then(() => history.back());
        },

        cancel() {
            this.set('errors', null);
            history.back();
        }
    }
});
