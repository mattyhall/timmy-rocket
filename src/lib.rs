#![feature(plugin, custom_derive)]
#![plugin(rocket_codegen)]
#[macro_use] extern crate diesel;
#[macro_use] extern crate diesel_codegen;
#[macro_use] extern crate serde_derive;
extern crate dotenv;
extern crate r2d2;
extern crate r2d2_diesel;
extern crate rocket;
extern crate serde_json;

pub mod db_help;
pub mod schema;
pub mod models;
