import foo
import gleam/dynamic
import gleam/io
import gleam/javascript/array
import gleam/json
import gleam/string
import lustre
import lustre/attribute
import lustre/effect
import lustre/element
import lustre/element/html
import lustre/event
import lustre_http

pub fn start(selector: String, cb: fn(Model) -> Nil) {
  let app = lustre.application(init, update, view)
  lustre.start(app, selector, cb)
}

pub fn foo_start(selector, state) {
  foo.start(selector, state)
}

pub fn convert_cat(cat: Cat) -> #(String, array.Array(String)) {
  #(cat.id, array.from_list(cat.tags))
}

fn cat_to_json(cat: Cat) -> String {
  json.object([
    #("id", json.string(cat.id)),
    #("tags", json.array(cat.tags, json.string)),
  ])
  |> json.to_string
}

fn cat_from_json(json_string: String) -> Result(Cat, json.DecodeError) {
  let cat_decoder =
    dynamic.decode2(
      Cat,
      dynamic.field("id", of: dynamic.string),
      dynamic.field("tags", of: dynamic.list(dynamic.string)),
    )

  json.decode(from: json_string, using: cat_decoder)
}

fn read_localstorage(key: String) -> effect.Effect(Msg) {
  effect.batch([
    effect.from(fn(dispatch) {
      let value = do_read_localstorage(key)
      CacheUpdatedMessage(key, value)
      |> dispatch
    }),
  ])
}

@external(javascript, "./gl.ffi.mjs", "read_localstorage")
fn do_read_localstorage(_key: String) -> Result(String, Nil) {
  Error(Nil)
}

fn write_localstorage(key: String, value: String) -> effect.Effect(msg) {
  effect.from(fn(_) { do_write_localstorage(key, value) })
}

@external(javascript, "./gl.ffi.mjs", "write_localstorage")
fn do_write_localstorage(_key: String, _value: String) -> Nil {
  Nil
}

pub type Model {
  Model(cat: Cat, loader: Bool)
}

pub type Cat {
  Cat(id: String, tags: List(String))
}

pub type User {
  User(name: String)
}

fn init(_) -> #(Model, effect.Effect(Msg)) {
  #(
    Model(cat: Cat("", [""]), loader: False),
    effect.batch([
      read_localstorage("user"),
      read_localstorage("cat"),
      read_localstorage("tags"),
    ]),
  )
}

pub type Msg {
  UserGetCat
  UserClearCat
  CacheUpdatedMessage(String, Result(String, Nil))
  ApiReturnedCat(Result(Cat, lustre_http.HttpError))
}

pub fn update(model: Model, msg: Msg) -> #(Model, effect.Effect(Msg)) {
  case msg {
    UserGetCat -> #(Model(..model, loader: True), get_cat())
    UserClearCat -> #(Model(..model, cat: Cat("cleared", [""])), effect.none())

    ApiReturnedCat(Ok(cat)) -> {
      case cat.tags {
        [] -> #(model, get_cat())
        _ -> #(
          Model(cat: cat, loader: False),
          write_localstorage("cat", cat_to_json(cat)),
        )
      }
    }
    ApiReturnedCat(Error(_)) -> {
      #(model, effect.none())
    }
    CacheUpdatedMessage(key, Ok(message)) ->
      case key {
        "cat" -> {
          case cat_from_json(message) {
            Ok(cat) -> #(Model(..model, cat: cat), effect.none())
            _ -> #(model, effect.none())
          }
        }
        _ -> #(model, effect.none())
      }
    CacheUpdatedMessage(_key, Error(_)) -> #(model, effect.none())
  }
}

fn get_cat() -> effect.Effect(Msg) {
  let decoder =
    dynamic.decode2(
      Cat,
      dynamic.field("_id", dynamic.string),
      dynamic.field("tags", dynamic.list(dynamic.string)),
    )
  let expect = lustre_http.expect_json(decoder, ApiReturnedCat)

  lustre_http.get("https://cataas.com/cat?json=true", expect)
}

pub fn view(model: Model) -> element.Element(Msg) {
  io.debug(model)
  html.div([], [
    html.div([attribute.class("flex mb-2")], [
      html.button(
        [event.on_click(UserGetCat), attribute.class("ml-1 btn variant-filled")],
        [element.text("get new cat")],
      ),
      html.button(
        [
          event.on_click(UserClearCat),
          attribute.class("ml-1 btn variant-filled"),
        ],
        [element.text("clear cat")],
      ),
    ]),
    html.div([], [
      case model.cat.id {
        "" -> html.text("no cat yet")
        "cleared" -> html.text("cat cleared")
        id -> {
          // check loader
          case model.loader {
            True -> html.text("loading...")
            False ->
              html.div([], [
                element.text(string.join(model.cat.tags, " ")),
                html.img([attribute.src("https://cataas.com/cat/" <> id)]),
              ])
          }
        }
      },
    ]),
  ])
}
