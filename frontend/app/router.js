import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('projects', function() {
      this.route('new');
      this.route('view', {path: '/view/:id'}, function() {
          this.route('charts');
      });
      this.route('edit', {path: '/edit/:id' });
      this.route('activities', function() {
          this.route('new');
          this.route('edit', {path: '/edit/:id'});
      });
  });

  this.route('timer');
  this.route('login');
});

export default Router;
