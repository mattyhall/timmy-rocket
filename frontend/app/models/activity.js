import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
    start_time: validator('presence', true),
    end_time: validator('presence', true)
});

export default DS.Model.extend(Validations, {
    description: DS.attr(),
    start_time: DS.attr(),
    end_time: DS.attr(),
    tags: DS.attr(),

    project: DS.belongsTo('project')
});
