#[derive(Queryable, Serialize, Deserialize)]
pub struct Project {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub active: bool,
}
