function DB(){
  this.db = null;
  this.objectStore = null;
}

DB.prototype.init = async function(databaseName,tableName,version){
  this.db = await this.createDb(databaseName,tableName,version);
};

// 创建数据库
DB.prototype.createDb = function(databaseName,tableName,version){
  return new Promise((resolve,reject) => {
    let request = window.indexedDB.open(databaseName,version);
    request.onupgradeneeded = function (event) {
      let db = event.target.result;
      let objectStore = db.createObjectStore(tableName, { autoIncrement: true });
      resolve(objectStore);
    }
    request.onsuccess = function(event) {
      let db = event.target.result;
      debugger
        resolve(objectStore);
    }
    request.onerror = function(event) {
      reject(event);
    }
  });
};
// 创建表
DB.prototype.createTable = function(db,tableName){
  var objectStore = db.createObjectStore(tableName, { autoIncrement: true });
  return objectStore;
};
// 新增表数据
DB.prototype.insert = function(db,databaseName,tableName,rowData){
  return new Promise((resolve,reject) => {
    let request = db.transaction([databaseName], 'readwrite')
      .objectStore(tableName)
      .add(rowData);
    request.onsuccess = function (event) {
      resolve(rowData);
    };
    request.onerror = function (event) {
      reject(event);
    };
  });
};
// 读取数据
DB.prototype.selectByKey = function(db,databaseName,tableName,key){
  return new Promise((resolve,reject) => {
    var transaction = db.transaction([databaseName]);
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.get(key);
    request.onsuccess = function(event) {
      resolve(request.result);
    };
    request.onerror = function(event) {
      reject(event);
    };
  });
};
// 读取所有数据
DB.prototype.selectAll = function(db,databaseName,tableName){
  return new Promise((resolve,reject) => {
    var objectStore = db.transaction([databaseName]).objectStore(tableName);
    objectStore.openCursor().onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        resolve(cursor.value);
        cursor.continue();
      } else {
        console.log('没有更多数据了！');
      }
    };
  });
};
// 更新数据
DB.prototype.update = function(db,databaseName,tableName,rowData){
  return new Promise((resolve,reject) => {
    var request = db.transaction([databaseName], 'readwrite')
    .objectStore(tableName)
    .put(rowData);
    request.onsuccess = function (event) {
      resolve(event);
    };
    request.onerror = function (event) {
      reject(event);
    }
  });
};
// 删除数据
DB.prototype.deleteData = function(db,databaseName,tableName,key){
  return new Promise((resolve,reject) => {
    var request = db.transaction([databaseName], 'readwrite')
    .objectStore(tableName)
    .delete(key);

    request.onsuccess = function (event) {
      resolve(event);
    };
    request.onerror = function (event) {
      reject(event);
    };
  });
};
// 创建索引
DB.prototype.createIndex = function(objectStore,indexName){
  objectStore.createIndex(indexName, indexName, { unique: false });
};






let func = async function(){
  let databaseName = "testDb";
  let tableName = "testTable";
  let objectStore = await createDb(databaseName,tableName,10);
  // let objectStore = createTable(db,tableName);
  // createIndex(objectStore,"name");
  // await insert(db,databaseName,tableName,{name:"jack",age:22});
  // let res = await selectByKey(db,databaseName,tableName,"jack");
  debugger
}
func();