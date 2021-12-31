const autoIncrement = (lastRecordId) => {
  let increasedNum = Number(lastRecordId.replace('P', '')) + 1
  let kmsStr = lastRecordId.substr(0, 1)
  for (let i = 0; i < 6 - increasedNum.toString().length; i++) {
    kmsStr = kmsStr + '0'
  }
  kmsStr = kmsStr + increasedNum.toString()
  return kmsStr
}

export default autoIncrement
