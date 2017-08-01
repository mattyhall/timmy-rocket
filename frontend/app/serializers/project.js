import DS from 'ember-data';
export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        activities: { embedded: 'always' },
        user: { key: 'user_id' }
    }
});
