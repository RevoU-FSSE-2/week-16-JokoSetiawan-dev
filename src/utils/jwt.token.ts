const jwt = require('jsonwebtoken')

const tokenGenerator = (payload: any) => {
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "1d",
  })
  return token
}

export default tokenGenerator