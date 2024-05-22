import lustre
import lustre/effect
import lustre/element
import lustre/element/html

pub type User {
  User(name: String)
}

pub type Msg

fn init(_) -> #(User, effect.Effect(Msg)) {
  #(User("yolo"), effect.none())
}

fn update(user: User, msg: Msg) -> #(User, effect.Effect(Msg)) {
  todo
}

pub fn login_view(user: User) -> element.Element(Msg) {
  html.div([], [element.text("Hello " <> user.name)])
}

pub fn login_app(selector) {
  let app = lustre.application(init, update, login_view)
  lustre.start(app, selector, Nil)
}
