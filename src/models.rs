use super::schema::projects;
use super::schema::activities;
use super::schema::users;
use super::schema::sessions;
use chrono::naive::NaiveDateTime;
use rocket::http::Status;
use rocket::request::{self, FromRequest};
use rocket::{Request, State, Outcome};
use rocket_contrib::Json;
use db_help::Pool;
use diesel::prelude::*;

#[derive(Insertable, Serialize, Deserialize, FromForm, Debug)]
#[table_name = "projects"]
pub struct NewProject {
    pub title: String,
    pub description: Option<String>,
    pub active: bool,
    pub user_id: i32,
}

#[derive(Queryable, Identifiable, Associations, Serialize, Deserialize, Debug)]
#[belongs_to(User)]
#[has_many(Activity)]
pub struct Project {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub active: bool,
    pub user_id: i32,
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[table_name = "activities"]
pub struct NewActivity {
    pub project_id: i32,
    pub description: Option<String>,
    pub start_time: NaiveDateTime,
    pub end_time: NaiveDateTime,
    pub tags: Vec<String>,
}

#[derive(Queryable, Identifiable, Associations, Serialize, Deserialize, Debug)]
#[table_name = "activities"]
#[belongs_to(Project)]
pub struct Activity {
    pub id: i32,
    pub project_id: i32,
    pub description: Option<String>,
    pub start_time: NaiveDateTime,
    pub end_time: NaiveDateTime,
    pub tags: Vec<String>,
}

#[derive(Queryable, Identifiable, Associations, Serialize, Deserialize, Debug)]
#[has_many(Project)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub password: String,
}

impl<'a, 'r> FromRequest<'a, 'r> for User {
    type Error = Json;
    fn from_request(request: &'a Request<'r>) -> request::Outcome<User, Self::Error> {
        let fail = Outcome::Failure((Status::ServiceUnavailable, Json(json!({}))));
        let pool = match request.guard::<State<Pool>>() {
            Outcome::Success(p) => p,
            _ => return fail
        };
        let conn = match pool.get() {
            Ok(conn) => conn,
            _ => return fail,
        };
        let fail = Outcome::Failure((Status::Unauthorized, Json(json!({}))));
        let token = match request.headers().get_one("Authorization") {
            Some(tok) => tok,
            _ => return fail,
        };
        let token = token.split(' ').nth(1).unwrap();
        let user = users::table
            .inner_join(sessions::table)
            .filter(sessions::dsl::token.eq(token))
            .select((users::dsl::id, users::dsl::username, users::dsl::password))
            .first::<User>(&*conn);
        match user {
            Ok(user) => Outcome::Success(user),
            _ => fail,
        }
    }
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[table_name = "users"]
pub struct NewUser {
    pub username: String,
    pub password: String,
}


#[derive(Queryable, Identifiable, Associations, Serialize, Deserialize, Debug)]
#[belongs_to(User)]
pub struct Session {
    pub id: i32,
    pub user_id: i32,
    pub token: String,
    pub expiry: NaiveDateTime,
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[table_name = "sessions"]
pub struct NewSession {
    pub user_id: i32,
    pub token: String,
    pub expiry: NaiveDateTime,
}
