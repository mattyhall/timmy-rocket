import Ember from 'ember';
import Sugar from 'npm:sugar';

export default Ember.Component.extend({
    tagName: '',

    fs: '',
    field_string: Ember.computed('date', {
        get() {
            return this.get('fs');
        },

        set(_, value) {
            try {
                let v = Sugar.Date.create(value);
                this.set('date', Sugar.Date(v).format('{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}').raw);
                this.set('fs', value);
                return value;
            } catch (err) {
                return value;
            }
        }
    }),

    init() {
        this._super(...arguments);
        let fs = '',
            date = this.get('date');
        if (date) {
            fs = Sugar.Date(date).format('{dd} {Mon} {yyyy} {HH}:{mm}:{ss}').raw;
        }
        this.set('fs', fs);
    }
});
