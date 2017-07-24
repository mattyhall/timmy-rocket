import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
    this.route('projects', function() {
        this.route('new');
        this.route('view', {path: '/view/:id'});
        this.route('edit', {path: '/edit/:id' });
    });
    this.route('timer');
});

export default Router;
