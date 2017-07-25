import Ember from 'ember';

export function formatTimedifference([start, end]/*, hash*/) {
    let duration = moment(end) - moment(start),
        diff = moment.utc(moment.duration(duration).asMilliseconds()),
        h = diff.format('H'),
        m = diff.format('m'),
        s = diff.format('s');
    var hrs = '',
        mins = '',
        secs = '';
    if (h !== '0') {
        hrs = h;
        if (h === '1') {
            hrs += 'hr ';
        } else {
            hrs += 'hrs ';
        }
    }
    if (m !=='0') {
        mins = m;
        if (m === '1') {
            mins += 'min ';
        } else {
            mins += 'mins ';
        }
    }

  return hrs + mins + secs;
}

export default Ember.Helper.helper(formatTimedifference);