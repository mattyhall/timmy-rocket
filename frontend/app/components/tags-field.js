import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',

    tags_string: Ember.computed('tags', {
        get() {
            return this.get('tags').join(', ');
        },
        set(_, value) {
            var split = value.split(/,/);
            split = split.map((tag) => tag.trim());
            this.set('tags', split);
            return value;
        }
    })
});
