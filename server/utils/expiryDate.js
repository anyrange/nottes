'use strict'

const MINUTE = 1000 * 60
const dates = {
  '10m': MINUTE * 10,
  '1h': MINUTE * 60,
  '1d': MINUTE * 60 * 24,
  '1w': MINUTE * 60 * 24 * 7,
  '2w': MINUTE * 60 * 24 * 7 * 2,
  '1month': MINUTE * 60 * 24 * 30,
}

module.exports = (time) => {
  return new Date(new Date().getTime() + dates[time])
}
