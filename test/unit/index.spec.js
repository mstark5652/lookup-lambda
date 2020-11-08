/* globals describe, expect, it, beforeEach */

const axios = require('axios')
const whois = require('whois')
const { handler } = require('../../index')

require('../support/node')

describe('index', function () {
  let event, address, domain
  beforeEach(function () {
    address = '192.168.1.1'
    domain = 'google.com'
    event = {
      queryStringParameters: {
        address,
        domain
      }
    }
    this.sinon.stub(axios, 'get').resolves({ data: {} })
    this.sinon.stub(whois, 'lookup').yields(null, { data: {} })
    this.sinon.stub(console, 'error')
  })
  describe('with ip address', function () {
    it('calls the right stuff', async function () {
      const result = await handler(event)
      expect(result.statusCode).to.eql(200)
      expect(axios.get.callCount).to.eql(1)
      expect(whois.lookup.callCount).to.eql(0)
    })
    it('calls with correct args', async function () {
      const result = await handler(event)
      expect(result.statusCode).to.eql(200)
      expect(axios.get.args[0][0]).to.match(/api.ipstack.com\/192.168.1.1/)
    })
  })
  describe('with domain', function () {
    beforeEach(function () {
      delete event.queryStringParameters.address
    })
    it('calls the right stuff', async function () {
      const result = await handler(event)
      expect(result.statusCode).to.eql(200)
      expect(axios.get.callCount).to.eql(0)
      expect(whois.lookup.callCount).to.eql(1)
    })
    it('calls with correct args', async function () {
      const result = await handler(event)
      expect(result.statusCode).to.eql(200)
      expect(whois.lookup.args[0][0]).to.eql(domain)
    })
  })

  describe('when invalid', function () {
    it('returns 500 when axios blows up', async function () {
      axios.get.rejects(new Error('wrench'))
      const result = await handler(event)
      expect(result.statusCode).to.eql(500)
      expect(result.body.error).to.match(/Something broke on our end/)
    })
    it('returns 500 when whois blows up', async function () {
      delete event.queryStringParameters.address
      whois.lookup.yields(new Error('wrench'))
      const result = await handler(event)
      expect(result.statusCode).to.eql(500)
      expect(result.body.error).to.match(/Something broke on our end/)
    })
    it('returns 400 bad request when address and domain', async function () {
      delete event.queryStringParameters
      const result = await handler(event)
      expect(result.statusCode).to.eql(400)
      expect(result.body.error).to.match(/You must provide query parameters/)
      expect(axios.get.callCount).to.eql(0)
      expect(whois.lookup.callCount).to.eql(0)
    })
  })
})
