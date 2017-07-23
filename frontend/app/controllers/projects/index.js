import Ember from 'ember';

export default Ember.Controller.extend({
    active_f: true,
    inactive_f: false,
    data: [],
    init() {
        this.filter();
    },

    filter() {
        let a = this.get('active_f');
        let i = this.get('inactive_f');
        let s = this.get('store');
        var data = null;
        if (a && i) {
            data = s.findAll('project');
        } else if (a) {
            data = s.query('project', {active: true});
        } else if (i) {
            data = s.query('project', {active: false});
        }
        this.set('data', data);
    },

    actions: {
        filter_toggled(item, val) {
            if (item == 'Active') {
                this.set('active_f', val);
            } else {
                this.set('inactive_f', val);
            }
            this.filter();
        }
    }
});
