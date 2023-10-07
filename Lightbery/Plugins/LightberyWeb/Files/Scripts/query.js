export { add, remove }

//添加 Query
function add (querys, newQuerys) {
  let analysis = []
  
  for (let [key, value] of new URLSearchParams(querys)) analysis.push(`${key}=${value}`)
    
  return analysis.concat(newQuerys).join('&')
}

//移除
function remove (querys, name) {
  let analysis = []
  
  for (let [key, value] of new URLSearchParams(querys)) {
    if (key !== name) analysis.push(`${key}=${value}`)
  }
    
  return analysis.join('&')
}