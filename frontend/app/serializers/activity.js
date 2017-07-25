import DS from 'ember-data';
export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        project: { key: 'project_id' }
    },
    serialize: function(record, options) {
        var json = this._super(record, options);
        json.project_id = parseInt(json.project_id);
        return json;
    }
});
