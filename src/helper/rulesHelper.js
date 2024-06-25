const ruleRequired = (val) => { return !!val }
const ruleMinLength = (val, min) => { return val.length >= min }
const ruleMaxLength = (val, max) => { return val.length <= max }
// eslint-disable-next-line
const ruleEmail = (val) => /^[\w.+_-]+@[\w.-]+\P{Alnum}{2,}$/.test(val);

export {
  ruleRequired,
  ruleMinLength,
  ruleMaxLength,
  ruleEmail
}
