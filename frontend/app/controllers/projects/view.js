import Ember from 'ember';
import moment from 'moment';
import {formatTimedifference} from 'frontend/helpers/format-timedifference';

export default Ember.Controller.extend({
    actions: {
        delete() {
            var model = this.get('model');
            model.deleteRecord();
            model.save().then(function() {
                history.back();
            });
        },
    }
});
