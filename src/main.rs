#![feature(plugin, custom_derive)]
#![plugin(rocket_codegen)]

extern crate rocket;
extern crate timmy_rocket;
#[macro_use]
extern crate rocket_contrib;
#[macro_use]
extern crate serde_derive;
extern crate diesel;
extern crate rocket_cors;
extern crate pwhash;
extern crate base64;
extern crate rand;
extern crate chrono;

use rand::Rng;
use rocket::http::Status;
use rocket::response::status::Custom;
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
fn get_projects(conn: DbConn, user: User) -> QueryResult<Json> {
    use timmy_rocket::schema::projects::dsl::*;
    Project::belonging_to(&user).load::<Project>(&*conn).map(
        |projs| {
            Json(json!({
                "projects": projs
            }))
        },
    )
}

#[get("/projects?<qs>")]
fn get_projects_qs(conn: DbConn, qs: ProjectsQS, user: User) -> QueryResult<Json> {
    use timmy_rocket::schema::projects::dsl::*;
    let projs = if let Some(val) = qs.active {
        projects
            .filter(active.eq(val))
            .filter(user_id.eq(user.id))
            .load::<Project>(&*conn)
    } else {
        projects.filter(user_id.eq(user.id)).load::<Project>(&*conn)
    };
    projs.map(|projs| {
        Json(json!({
            "projects": projs
        }))
    })
}

fn gp(conn: DbConn, p_id: i32, user: User) -> QueryResult<Json> {
    use timmy_rocket::schema::projects::dsl as p;
    use timmy_rocket::schema::activities::dsl as a;
    let project: Project = p::projects
        .find(p_id)
        .filter(p::user_id.eq(user.id))
        .first(&*conn)?;
    let acts: Vec<Activity> = Activity::belonging_to(&project)
        .order(a::start_time.desc())
        .load::<Activity>(&*conn)?;
    Ok(Json(json!({
        "project": {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "active": project.active,
            "activities": acts,
        }
    })))
}

#[get("/projects/<p_id>")]
fn get_project(conn: DbConn, p_id: i32, user: User) -> QueryResult<Json> {
    gp(conn, p_id, user)
}

#[derive(Deserialize)]
struct NoUserProject {
    title: String,
    description: Option<String>,
    active: bool,
}

#[derive(Deserialize)]
struct WrappedProject {
    project: NoUserProject,
}


#[put("/projects/<p_id>", data = "<proj>")]
fn put_project(
    conn: DbConn,
    p_id: i32,
    proj: Json<WrappedProject>,
    user: User,
) -> Result<Json, Custom<Json>> {
    use timmy_rocket::schema::projects::dsl::*;
    let proj = proj.0.project;
    diesel::update(projects.filter(id.eq(p_id)).filter(user_id.eq(user.id)))
        .set((
            title.eq(proj.title),
            description.eq(proj.description),
            active.eq(proj.active),
        ))
        .get_result::<Project>(&*conn)
        .and_then(|proj| gp(conn, proj.id, user))
        .map_err(|_| Custom(Status::UnprocessableEntity, Json(json!({}))))
}

#[delete("/projects/<p_id>")]
fn delete_project(conn: DbConn, p_id: i32, user: User) -> Result<Json, Custom<Json>> {
    use timmy_rocket::schema::projects::dsl as p;
    use timmy_rocket::schema::activities::dsl as a;
    // Make sure the project belongs to the user before deleting
    let _ = p::projects
        .filter(p::id.eq(p_id))
        .filter(p::user_id.eq(user.id))
        .first::<Project>(&*conn)
        .map_err(|err| Custom(Status::Unauthorized, Json(json!({}))))?;
    diesel::delete(a::activities.filter(a::project_id.eq(p_id)))
        .execute(&*conn)
        .map_err(|err| {
            println!("{:?}", err);
            return Custom(Status::UnprocessableEntity, Json(json!({})));
        })?;

    diesel::delete(p::projects.filter(p::id.eq(p_id)))
        .execute(&*conn)
        .map(|_| Json(json!({})))
        .map_err(|err| {
            println!("{:?}", err);
            return Custom(Status::UnprocessableEntity, Json(json!({})));
        })
}

#[post("/projects", data = "<proj>")]
fn post_project(
    conn: DbConn,
    proj: Json<WrappedProject>,
    user: User,
) -> Result<Json, Custom<Json>> {
    use timmy_rocket::schema::projects;
    let mut proj = proj.0.project;
    let proj = NewProject {
        title: proj.title,
        description: proj.description,
        active: proj.active,
        user_id: user.id,
    };
    diesel::insert(&proj)
        .into(projects::table)
        .get_result::<Project>(&*conn)
        .and_then(|proj| gp(conn, proj.id, user))
        .map_err(|_| Custom(Status::UnprocessableEntity, Json(json!({}))))
}

#[get("/activities")]
fn get_activities(conn: DbConn, user: User) -> QueryResult<Json> {
    use timmy_rocket::schema::activities::dsl::*;
    activities.load::<Activity>(&*conn).map(|acts| {
        Json(json!({
            "activities": acts
        }))
    })
}

#[get("/activities/<a_id>")]
fn get_activity(conn: DbConn, a_id: i32, user: User) -> Result<Json, Custom<Json>> {
    use timmy_rocket::schema::activities::dsl::*;
    use timmy_rocket::schema::projects as p;
    let (_, p) = activities.inner_join(p::table).filter(id.eq(a_id)).first::<(Activity, Project)>(&*conn).map_err(|_| Custom(Status::UnprocessableEntity, Json(json!({}))))?;
    if p.user_id != user.id {
        return Err(Custom(Status::Unauthorized, Json(json!({}))));
    }
    activities.find(a_id).first::<Activity>(&*conn).map(|a| {
        Json(json!({"activity": a}))
    }).map_err(|_| Custom(Status::UnprocessableEntity, Json(json!({}))))
}

#[derive(Deserialize)]
struct WrappedActivity {
    activity: NewActivity,
}

#[put("/activities/<a_id>", data = "<act>")]
fn put_activity(
    conn: DbConn,
    a_id: i32,
    act: Json<WrappedActivity>,
    user: User,
) -> Result<Json, Custom<Json>> {
    use timmy_rocket::schema::activities::dsl::*;
    use timmy_rocket::schema::projects as p;
    let (_, p) = activities.inner_join(p::table).filter(id.eq(a_id)).first::<(Activity, Project)>(&*conn).map_err(|_| Custom(Status::UnprocessableEntity, Json(json!({}))))?;
    if p.user_id != user.id {
        return Err(Custom(Status::Unauthorized, Json(json!({}))));
    }
    let act = act.0.activity;
    diesel::update(activities.filter(id.eq(a_id)))
        .set((
            description.eq(act.description),
            start_time.eq(act.start_time),
            end_time.eq(act.end_time),
            tags.eq(act.tags),
        ))
        .execute(&*conn)
        .map(|_| Json(json!({})))
        .map_err(|_| Custom(Status::UnprocessableEntity, Json(json!({}))))
}

#[delete("/activities/<a_id>")]
fn delete_activity(conn: DbConn, a_id: i32, user: User) -> Result<Json, Custom<Json>> {
    use timmy_rocket::schema::activities::dsl::*;
    use timmy_rocket::schema::projects as p;
    let (_, p) = activities.inner_join(p::table).filter(id.eq(a_id)).first::<(Activity, Project)>(&*conn).map_err(|_| Custom(Status::UnprocessableEntity, Json(json!({}))))?;
    if p.user_id != user.id {
        return Err(Custom(Status::Unauthorized, Json(json!({}))));
    }
    diesel::delete(activities.filter(id.eq(a_id)))
        .execute(&*conn)
        .map(|_| Json(json!({})))
        .map_err(|err| {
            println!("{:?}", err);
            return Custom(Status::UnprocessableEntity, Json(json!({})));
        })
}

#[post("/activities", data = "<act>")]
fn post_activity(
    conn: DbConn,
    act: Json<WrappedActivity>,
    user: User,
) -> Result<Json, Custom<Json>> {
    use timmy_rocket::schema::activities;
    let act = act.0.activity;
    diesel::insert(&act)
        .into(activities::table)
        .get_result::<Activity>(&*conn)
        .map(|act| Json(json!({"activity": act})))
        .map_err(|_| Custom(Status::UnprocessableEntity, Json(json!({}))))
}

#[post("/users/login", data = "<user>")]
fn post_login(conn: DbConn, user: Json<NewUser>) -> Result<Json, Custom<Json>> {
    use timmy_rocket::schema::users::dsl::*;
    let e = || {
        Custom(
            Status::Unauthorized,
            Json(
                json!({"errors": ["No such user or username and password did not match"]}),
            ),
        )
    };
    let db_user = users
        .filter(username.eq(&user.username))
        .first::<User>(&*conn)
        .map_err(|_| e())?;
    if !pwhash::bcrypt::verify(&user.password, &db_user.password) {
        return Err(e());
    }
    use timmy_rocket::schema::sessions;
    let expiry = chrono::Utc::now().naive_utc();
    let mut rng = rand::OsRng::new().unwrap();
    let mut buff = [0u8; 16];
    rng.fill_bytes(&mut buff);
    let token = base64::encode(&buff);
    let s = NewSession {
        token,
        expiry,
        user_id: db_user.id,
    };
    diesel::insert(&s)
        .into(sessions::table)
        .get_result::<Session>(&*conn)
        .map(|sess| Json(json!({"token": sess.token})))
        .map_err(|_| e())

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
        .mount(
            "/",
            routes![get_projects, get_projects_qs, get_project, put_project,
                    delete_project, post_project,
                    get_activity, put_activity, post_activity,
                    delete_activity,
                    post_login],
        )
        .launch();
}
