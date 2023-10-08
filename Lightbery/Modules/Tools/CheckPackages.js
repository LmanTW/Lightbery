//檢查套件
module.exports = (packages) => {
  let missingPackages = []

  packages.forEach((item) => {
    try {require(item)}
    catch (error) {missingPackages.push(item)}
  })

  if (missingPackages.length > 0) throw new Error(`缺少套件 ${missingPackages.join(', ')}`)
}