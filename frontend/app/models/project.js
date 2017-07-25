import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr(),
    description: DS.attr(),
    active: DS.attr(),
    activities: DS.hasMany('activity', {async:true})
});
