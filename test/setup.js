var chai = require('chai')
var jsdom = require('jsdom')

chai.use(require('sinon-chai'))

global.__DEV__ = false
global.__TEST__ = true
global.__PRODUCTION__ = false
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.navigator = {
  userAgent: 'JSDOM'
}

var document = jsdom.jsdom('<!doctype html><html><body></body></html>')
var window = document.defaultView

global.document = document
global.window = window

for (var key in window) {
  if (!window.hasOwnProperty(key)) continue
  if (key in global) continue

  global[key] = window[key]
}
