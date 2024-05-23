import gleam/dict
import gleam/io
import gleam/javascript/array
import gleam/javascript/promise

pub fn main() {
  io.println("Hello from backend_gleam!")
}

pub type Table

pub type Database

@external(javascript, "./ffi.mjs", "new_database")
pub fn new_database(dialect: String, storage: String) -> Database

@external(javascript, "./ffi.mjs", "define_table")
pub fn define_table(
  db: Database,
  table_name: String,
  args: array.Array(#(string, string)),
) -> Table

@external(javascript, "./ffi.mjs", "insert")
pub fn insert(
  table: Table,
  args: array.Array(#(string, string)),
) -> promise.Promise(Table)

@external(javascript, "./ffi.mjs", "sync_db")
pub fn sync_db(db: Database) -> promise.Promise(Database)

pub fn make_new_db() {
  let db = new_database("sqlite", "foo.db")
  let table = define_table(db, "User", array.from_list([#("name", "string")]))
  let p = sync_db(db)
  promise.await(p, _)
  let p = insert(table, array.from_list([#("name", "Jane")]))
  promise.await(p, _)
}
