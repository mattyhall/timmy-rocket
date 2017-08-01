import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
    title: validator('presence', true)
});

export default DS.Model.extend(Validations, {
    title: DS.attr(),
    description: DS.attr(),
    active: DS.attr(),
    activities: DS.hasMany('activity', {async:true}),
    user: DS.belongsTo('user')
});
