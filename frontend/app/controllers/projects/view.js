import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        delete() {
            var model = this.get('model');
            model.deleteRecord();
            model.save().then(function() {
                history.back();
            });
        }
    }
});
