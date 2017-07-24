use super::schema::projects;

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
