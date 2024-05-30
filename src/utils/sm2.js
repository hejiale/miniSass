const sm2 = require('sm-crypto').sm2
const cipherMode = 0 // 1 - C1C3C2，0 - C1C2C3，默认为1

// 加密方法
export function doEncrypt (data) {
  const publicKey = '' // 公钥
  const encryptData = sm2.doEncrypt(data, publicKey, cipherMode) // 加密结果
  return encryptData
}

// 解密方法
export function doDecrypt (data) {
  const privateKey = '028984c7d39127fc32676925043975e2d6b4d2e0d9c6be92aa49963a7ceb8abd' // 私钥
  const decryptData = sm2.doDecrypt(data, privateKey, cipherMode)
  console.log(decryptData)
  return decryptData
}
