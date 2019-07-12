let createDb = function(databaseName,version){
  return new Promise((resolve,reject) => {
    let request = window.indexedDB.open(databaseName,version);
    request.onupgradeneeded = function (event) {
      let db = event.target.result;
      resolve(db);
    }
    request.onsuccess = function(event) {
      resolve(event.target.result);
    }
    request.onerror = function(event) {
      reject(event);
    }
  });
}
let createTable = function(db,tableName){
  var objectStore = db.createObjectStore(tableName, { keyPath: 'id' });
  return objectStore;
}





let func = async function(){
  let db = await createDb("testDb",10);
  debugger
}
func();