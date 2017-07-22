#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;
extern crate timmy_rocket;
#[macro_use] extern crate rocket_contrib;
extern crate diesel;

use diesel::prelude::*;
use rocket_contrib::{Json, Value};
use timmy_rocket::db_help::{init_pool, DbConn};
use timmy_rocket::models::*;

#[get("/projects")]
fn get_projects(conn: DbConn) -> QueryResult<Json<Vec<Project>>> {
    use timmy_rocket::schema::projects::dsl::*;
    projects.filter(active.eq(true)).load::<Project>(&*conn).map(|proj| Json(proj))
}

fn main() {
    rocket::ignite().manage(init_pool()).mount("/", routes![get_projects]).launch();
}
