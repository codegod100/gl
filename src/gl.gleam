import gleam/bit_array
import gleam/dynamic
import gleam/int
import gleam/io
import gleam/javascript/array
import gleam/json
import gleam/list
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

@external(javascript, "./gl.ffi.mjs", "prompt")
fn prompt() -> String

fn write_localstorage(key: String, value: String) -> effect.Effect(msg) {
  effect.from(fn(_) { do_write_localstorage(key, value) })
}

@external(javascript, "./gl.ffi.mjs", "write_localstorage")
fn do_write_localstorage(_key: String, _value: String) -> Nil {
  Nil
}

pub type Model {
  Model(
    count: Int,
    cat: Cat,
    loader: Bool,
    user: User,
    verified: Bool,
    cb: fn(Model) -> Nil,
  )
}

pub type Cat {
  Cat(id: String, tags: List(String))
}

pub type User {
  User(name: String)
}

fn init(cb) -> #(Model, effect.Effect(Msg)) {
  #(
    Model(
      count: 0,
      cat: Cat("", [""]),
      loader: False,
      user: User(""),
      verified: False,
      cb: cb,
    ),
    effect.batch([
      read_localstorage("user"),
      read_localstorage("cat"),
      read_localstorage("tags"),
    ]),
  )
}

pub type Msg {
  UserGetCat
  Increment
  Decrement(x: Int)
  UserClearCat
  UserSignIn
  UserSignOut
  CacheUpdatedMessage(String, Result(String, Nil))
  UserCheckVerify(Bool)
  ApiReturnedCat(Result(Cat, lustre_http.HttpError))
}

fn sign_in(name) -> effect.Effect(Msg) {
  effect.batch([get_cat(), write_localstorage("user", name)])
}

pub fn update(model: Model, msg: Msg) -> #(Model, effect.Effect(Msg)) {
  case msg {
    UserGetCat -> #(Model(..model, loader: True), get_cat())
    UserClearCat -> #(Model(..model, cat: Cat("cleared", [""])), effect.none())
    UserSignIn -> {
      let name = prompt()
      #(Model(..model, loader: True, user: User(name)), sign_in(name))
    }
    UserSignOut -> #(
      Model(..model, user: User("")),
      write_localstorage("user", ""),
    )
    ApiReturnedCat(Ok(cat)) -> {
      io.debug(cat)
      case cat.tags {
        [] -> #(model, get_cat())
        _ -> #(
          Model(..model, cat: cat, loader: False),
          write_localstorage("cat", cat_to_json(cat)),
        )
      }
    }
    ApiReturnedCat(Error(err)) -> {
      io.debug(err)
      #(model, effect.none())
    }
    Increment -> #(Model(..model, count: model.count + 42), effect.none())
    Decrement(x) -> #(Model(..model, count: model.count - x), effect.none())
    CacheUpdatedMessage(key, Ok(message)) ->
      case key {
        "user" -> #(Model(..model, user: User(message)), effect.none())
        "cat" -> {
          case cat_from_json(message) {
            Ok(cat) -> #(Model(..model, cat: cat), effect.none())
            _ -> #(model, effect.none())
          }
        }
        _ -> #(model, effect.none())
      }
    CacheUpdatedMessage(_key, Error(_)) -> #(model, effect.none())
    UserCheckVerify(val) -> #(Model(..model, verified: val), effect.none())
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
  model.cb(model)
  io.debug(model)
  case model.user.name {
    "" ->
      html.div([], [
        html.button(
          [event.on_click(UserSignIn), attribute.class("btn variant-filled")],
          [element.text("sign in")],
        ),
      ])
    name ->
      html.div([], [
        html.div([attribute.class("flex")], [
          html.div([attribute.class("p-1")], [element.text("Hello " <> name)]),
          html.button(
            [
              event.on_click(UserSignOut),
              attribute.class("btn variant-filled mb-1"),
            ],
            [element.text("sign out")],
          ),
        ]),
        html.div([attribute.class("flex mb-2")], [
          html.button(
            [
              event.on_click(UserGetCat),
              attribute.class("ml-1 btn variant-filled"),
            ],
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
}
