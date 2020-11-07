const { handler } = require('../index')

const main = async () => {
  const result = await handler({
    queryStringParameters: {
      // address: '162.202.156.240'
      domain: 'google.com'
    }
  })
  console.log('result', result.body)
}

main()