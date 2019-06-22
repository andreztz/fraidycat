import { location } from "@kickscondor/router"

export const hyperload = tree => {
  const modules = {}

  for (let name in (tree.modules || {})) {
    modules[name] = hyperload(tree.modules[name])
  }

  const state = tree.state || {}
  const actions = tree.actions || {}
  const view = tree.view

  modules.location = location
  for (let name in modules) {
    state[name] = modules[name].state || {}
    actions[name] = Object.assign({set: o => o}, modules[name].actions)
  }

  actions.initialize = _ => (_, actions) => {
    location.subscribe(actions.location)

    if (typeof(actions.init) !== 'undefined') {
      actions.init()
    }
  }

  return {state, actions, view}
}
