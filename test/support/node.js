/* global beforeEach, afterEach */

if (process.env.NODE_ENV !== 'test') throw new Error('Tests should only run in NODE_ENV=test!')

const sinon = require('sinon')
const chai = require('chai')

chai.use(require('sinon-chai'))

global.expect = chai.expect
global.expect = chai.expect
global.AssertionError = chai.AssertionError
global.Assertion = chai.Assertion
global.assert = chai.assert

beforeEach(function () {
  this.sinon = sinon.createSandbox()
})

afterEach(function () {
  if (this.sinon && this.sinon.restore) this.sinon.restore()
})
