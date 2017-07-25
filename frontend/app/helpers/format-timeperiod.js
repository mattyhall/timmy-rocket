import Ember from 'ember';
import moment from 'moment';

export function formatTimeperiod([start, end]/*, hash*/) {
    let s = moment(start).format('HH:mm'),
        e = moment(end).format('HH:mm');
    return `${s}-${e}`;
}

export default Ember.Helper.helper(formatTimeperiod);
