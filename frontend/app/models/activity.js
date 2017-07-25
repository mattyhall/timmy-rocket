import DS from 'ember-data';

export default DS.Model.extend({
    description: DS.attr(),
    start_time: DS.attr(),
    end_time: DS.attr(),
    tags: DS.attr(),

    project: DS.belongsTo('project'),
});
