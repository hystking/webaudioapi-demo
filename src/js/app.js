import index from "./index"
import free from "./free"

function routes(path) {
  switch(true) {
    case /free\.html/.test(path):
      return free()
      break;
    default:
      return index()
  }
}

routes(window.location.pathname)
