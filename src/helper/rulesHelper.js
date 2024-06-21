const ruleRequired = (val) => { return !!val }
const ruleMinLength = (val, min) => { return val.length >= min }
const ruleMaxLength = (val, max) => { return val.length <= max }
// eslint-disable-next-line
const ruleEmail = (val) => { return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val) }

export {
  ruleRequired,
  ruleMinLength,
  ruleMaxLength,
  ruleEmail
}
