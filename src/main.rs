#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;
extern crate timmy_rocket;
#[macro_use] extern crate rocket_contrib;
extern crate diesel;
extern crate rocket_cors;

use rocket_cors::{AllowedOrigins, AllowedHeaders};
use rocket::http::Method;
use diesel::prelude::*;
use rocket_contrib::{Json, Value};
use timmy_rocket::db_help::{init_pool, DbConn};
use timmy_rocket::models::*;

#[get("/projects")]
fn get_projects(conn: DbConn) -> QueryResult<Json> {
    use timmy_rocket::schema::projects::dsl::*;
    projects.filter(active.eq(true)).load::<Project>(&*conn).map(|projs| Json(json!({"projects": projs})))
}

fn main() {
    let all_origins = AllowedOrigins::all();
    let options = rocket_cors::Cors {
        allowed_origins: all_origins,
        allowed_methods: vec![Method::Get].into_iter().map(From::from).collect(),
        allowed_headers: AllowedHeaders::all(),
        allow_credentials: true,
        ..Default::default()
    };
    rocket::ignite().manage(init_pool()).attach(options).mount("/", routes![get_projects]).launch();
}
