use super::schema::projects;
use super::schema::activities;
use chrono::naive::NaiveDateTime;

#[derive(Insertable, Serialize, Deserialize, FromForm, Debug)]
#[table_name="projects"]
pub struct NewProject {
    pub title: String,
    pub description: Option<String>,
    pub active: bool,
}

#[derive(Queryable, Identifiable, Associations, Serialize, Deserialize, Debug)]
#[has_many(Activity)]
pub struct Project {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub active: bool,
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[table_name="activities"]
pub struct NewActivity {
    pub project_id: i32,
    pub description: Option<String>,
    pub start_time: NaiveDateTime,
    pub end_time: NaiveDateTime,
    pub tags: Vec<String>,
}

#[derive(Queryable, Identifiable, Associations, Serialize, Deserialize, Debug)]
#[table_name="activities"]
#[belongs_to(Project)]
pub struct Activity {
    pub id: i32,
    pub project_id: i32,
    pub description: Option<String>,
    pub start_time: NaiveDateTime,
    pub end_time: NaiveDateTime,
    pub tags: Vec<String>,
}
