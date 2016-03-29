/* eslint-disable no-unused-vars */
class Vue {
  constructor(selector, data) {
    this.$el = document.querySelector(selector)
    this._data = observe(data)

    this.watchData()
  }

  $watch(exp, cb) {
    /* eslint-disable no-new */
    new Watcher(this, exp, cb)
    /* eslint-enable no-new */
  }

  watchData() {
    Object.keys(this._data).forEach((key) => {
      let el = this.$el.querySelector(`[v-model="${key}"]`)
      if (el) {
        el.value = this._data[key]
        el.addEventListener('change', () => this._data[key] = el.value, false)
        el.addEventListener('input', () => this._data[key] = el.value, false)

        this.$watch(key, function(newVal) {
          el.value = newVal
        })
      }
    })
  }
}
/* eslint-enable no-unused-vars */

class Observer {
  constructor(value) {
    Object.keys(value).forEach((key) => {
      defineReactive(this, key, value[key])
    })
  }
}

function defineReactive(obj, key, val) {
  let dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      if (Dep.target) {
        dep.addSUb(Dep.target)
      }
      return val
    },
    set(newVal) {
      if (newVal === val) {
        return
      }
      val = newVal
      dep.notify()
    }
  })
}

function observe (value) {
  if (!value || typeof value !== 'object') {
    return
  }
  return new Observer(value)
}

class Dep {
  constructor() {
    this.subs = []
  }
  addSUb(sub) {
    this.subs.push(sub)
  }
  notify() {
    this.subs.forEach((sub) => sub.update())
  }
}

class Watcher {
  constructor(vm, exp, cb) {
    this.vm = vm
    this.cb = cb
    this.exp = exp
    this.value = this.get()
  }
  update() {
    let value = this.vm._data[this.exp]
    if (value !== this.value) {
      this.value = value
      this.cb.call(this.vm, value)
    }
  }
  get() {
    Dep.target = this
    const value = this.vm._data[this.exp]
    Dep.target = null

    return value
  }
}
