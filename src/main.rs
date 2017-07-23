#![feature(plugin, custom_derive)]
#![plugin(rocket_codegen)]

extern crate rocket;
extern crate timmy_rocket;
#[macro_use]
extern crate rocket_contrib;
extern crate diesel;
extern crate rocket_cors;

use rocket_cors::{AllowedOrigins, AllowedHeaders};
use rocket::http::Method;
use diesel::prelude::*;
use rocket_contrib::{Json, Value};
use timmy_rocket::db_help::{init_pool, DbConn};
use timmy_rocket::models::*;

#[derive(FromForm)]
struct ProjectsQS {
    active: Option<bool>,
}

#[get("/projects")]
fn get_projects(conn: DbConn) -> QueryResult<Json> {
    use timmy_rocket::schema::projects::dsl::*;
    projects.load::<Project>(&*conn).map(|projs| {
        Json(json!({
            "projects": projs
        }))
    })
}

#[get("/projects?<qs>")]
fn get_projects_qs(conn: DbConn, qs: ProjectsQS) -> QueryResult<Json> {
    use timmy_rocket::schema::projects::dsl::*;
    let projs = if let Some(val) = qs.active {
        projects.filter(active.eq(val)).load::<Project>(&*conn)
    } else {
        projects.load::<Project>(&*conn)
    };
    projs.map(|projs| {
        Json(json!({
            "projects": projs
        }))
    })
}

#[get("/projects/<p_id>")]
fn get_project(conn: DbConn, p_id: i32) -> QueryResult<Json> {
    use timmy_rocket::schema::projects::dsl::*;
    projects.find(p_id).first(&*conn).map(|proj: Project| {
        Json(json!({
            "project": proj
        }))
    })
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
    rocket::ignite()
        .manage(init_pool())
        .attach(options)
        .mount("/", routes![get_projects, get_projects_qs, get_project])
        .launch();
}
