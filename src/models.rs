use super::schema::projects;
use chrono::naive::NaiveDateTime;

#[derive(Insertable, Serialize, Deserialize, FromForm, Debug)]
#[table_name="projects"]
pub struct NewProject {
    pub title: String,
    pub description: Option<String>,
    pub active: bool,
}

#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct Project {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub active: bool,
}

#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct Activity {
    pub id: i32,
    pub project_id: i32,
    pub description: Option<String>,
    pub start_time: NaiveDateTime,
    pub end_time: NaiveDateTime,
    pub tags: Vec<String>,
}
