const axios = require('axios')
const whois = require('whois')

const IP_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
const DOMAIN_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/
const IP_STACK_KEY = process.env.IP_STACK_KEY

const fetchIpAddress = async address => {
  const response = await axios.get(`http://api.ipstack.com/${address}?access_key=${IP_STACK_KEY}`)
  return response && response.data
}

const lookupDomain = async domain => {
  return new Promise((resolve, reject) => {
    whois.lookup(domain, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

exports.handler = async (event) => {
  const params = event.queryStringParameters || {}

  try {
    if (params.address && IP_REGEX.test(params.address)) {
      const result = await fetchIpAddress(params.address)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(result)
      }
    } else if (params.domain && DOMAIN_REGEX.test(params.domain)) {
      const result = await lookupDomain(params.domain)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ data: result })
      }
    }
  } catch (error) {
    console.error('Failed to fetch data', { params, error })
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: { error: 'Something broke on our end. Oops.' }
    }
  }

  return {
    statusCode: 400,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: { error: 'You must provide query parameters of \'address\' or \'domain\'' }
  }
}
