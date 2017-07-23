import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        save() {
            var t = this;
            this.model.save().then(function() {
                history.back();
            });
        }
    }
});
