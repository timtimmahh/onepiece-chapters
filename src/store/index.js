import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'
import global from './global'
import ui from './ui'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      global,
      ui
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })
  if (process.env.DEV && module.hot) {
    module.hot.accept(["./global", './ui'], () => {
      const newGlobal = require("./global").default;
      const newUi = require('./ui').default;
      Store.hotUpdate({ modules: { global: newGlobal, ui: newUi } });
    });
  }
  return Store
}
