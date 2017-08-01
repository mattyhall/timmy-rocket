#![feature(plugin, custom_derive, custom_attribute)]
#![plugin(rocket_codegen)]
#[macro_use] extern crate diesel;
#[macro_use] extern crate diesel_codegen;
#[macro_use] extern crate serde_derive;
#[macro_use] extern crate rocket_contrib;
extern crate chrono;
extern crate dotenv;
extern crate r2d2;
extern crate r2d2_diesel;
extern crate rocket;
extern crate serde_json;

pub mod db_help;
pub mod schema;
pub mod models;
