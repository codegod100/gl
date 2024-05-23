import gleam/io
import lustre
import lustre/effect
import lustre/element
import lustre/element/html

pub type State {
  State(name: String, sport: String)
}

pub type Msg

fn init(state) -> #(State, effect.Effect(Msg)) {
  #(state, effect.none())
}

fn update(state: State, msg: Msg) -> #(State, effect.Effect(Msg)) {
  #(state, effect.none())
}

pub fn view(state: State) -> element.Element(Msg) {
  io.debug(state)
  html.div([], [
    element.text(
      "Sup " <> state.name <> " this is gleam and I was born " <> state.sport,
    ),
  ])
}

pub fn start(selector, state) {
  io.debug("starting")
  io.debug(state)
  let app = lustre.application(init, update, view)
  lustre.start(app, selector, state)
}
// @external(javascript, "./gl.ffi.mjs", "read_user")
// pub fn read_user() -> String
