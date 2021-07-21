import { formatDistanceToNowStrict } from 'date-fns'

export default ({ app }, inject) => {
  inject('timePassedFrom', function (date) {
    return formatDistanceToNowStrict(Date.parse(date), {
      addSuffix: true,
    })
  })
}
