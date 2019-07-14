

class IndexDB{
  /**
   * dbName
   * version
   * storeInfo
   * 结构：
    let storeInfo = [
        {
          storeName:"optionsData",
          keyPath:"filename",
          indexs:[
            // {indexName:"name",showName:"name",options:{ unique: false }}
          ]
        }
      ];
   */
  constructor(dbName,version){
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }
  /**
   * 创建objectStore
   */
  createObjectStore(storeInfo){
    let _this = this;
    _this.storeInfo = storeInfo;
    return new Promise((resolve,reject) => {
      var request = window.indexedDB.open(this.dbName, this.version);
      request.onsuccess = function(event){
        console.log(`连接到IndexDB:${_this.dbName},version:${_this.version}`);
        _this.db = event.target.result;
        resolve(_this.db);
      }
      request.onupgradeneeded = async function(event){
        console.log(`创建新的IndexDB:${_this.dbName},version:${_this.version}`);
        _this.db = event.target.result;
        await _this.__createStore();
      }
      request.onerror = function(event){
        console.log(`创建IndexDB${_this.dbName}出错`);
        reject(event);
      }
    });
  }
  __createStore(){
    for(let i=0;i<this.storeInfo.length;i++){
      let storeItem = this.storeInfo[i];
      let storeName = storeItem.storeName;
      let keyPath = storeItem.keyPath;
      if(this.db.objectStoreNames.contains(storeName)){
        console.log(`objectStore名称${storeName}已经存在`);
      }else{
        console.log(`创建store:${storeName},keyPath:${keyPath},indexs:${JSON.stringify(storeItem.indexs)}`);
        let objectStore = this.db.createObjectStore(storeName,{autoIncrement:true,keyPath:keyPath});
        for(let j=0;j<storeItem.indexs.length;j++){
          let {indexName,showName,options} = storeItem.indexs[j];
          objectStore.createIndex(indexName,showName,options);
        }
      }
      
    }
  }
  /**
   * 获取store
   */
  __getStore(storeName){
    return this.db.transaction([storeName], 'readwrite').objectStore(storeName);
  }
  /**
   * 重复添加会报错
   * @param {String} storeName store名称
   * @param {Object} row 需要插入的数据
   */
  add(storeName,row){
    let _this = this;
    return new Promise((resolve,reject) => {
      let transaction = _this.db.transaction([storeName],"readwrite");
      let objectStore = transaction.objectStore(storeName);
      let request = objectStore.add(row);
      request.onsuccess = function(){
        resolve(row);
      }
      request.onerror = function(e){
        reject(e);
      }
    });
  }
  /**
   * 
   * @param {String} storeName store名称
   * @param {Object} id 
   */
  deleteById(storeName,id){
    let _this = this;
    return new Promise((resolve,reject) => {
      let transaction = _this.db.transaction([storeName],"readwrite");
      let objectStore = transaction.objectStore(storeName);
      let request = objectStore.delete(id);
      request.onsuccess = function(event){
        resolve(id);
      }
      request.onerror = function(event){
        reject(event);
      }
    });
  }
  /**
   * 
   * @param {String} storeName store名称
   * @param {Object} id 
   */
  selectById(storeName,id){
    let _this = this;
    return new Promise((resolve,reject) => {
      var transaction = _this.db.transaction([storeName]);
      var objectStore = transaction.objectStore(storeName);
      var request = objectStore.get(id);

      request.onerror = function(event) {
        reject(event);
      };
      request.onsuccess = function(event) {
        resolve(request.result);
      };
    });
  }
  /**
   * 
   * @param {String} storeName store名称
   * @param {Object} indexName 索引名称
   * @param {Object} indexValue 索引值
   */
  selectByIndex(storeName,indexName,indexValue){
    return new Promise((resolve,reject) => {
      var transaction = db.transaction([storeName], 'readonly');
      var store = transaction.objectStore(storeName);
      var index = store.index(indexName);
      var request = index.get(indexValue);
      request.onsuccess = function (event) {
        var result = event.target.result;
        resolve(result);
      }
      request.onerror = function(event){
        reject(event);
      }
    });
  }
  /**
   * @param {String} storeName store名称
   */
  selectAll(storeName){
    let _this = this;
    return new Promise((resolve,reject) => {
      var objectStore = _this.db.transaction(storeName).objectStore(storeName);
      let results = [];
      objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
    });
  }
  /**
   *  可用着新增 重复添加不会报错
   * @param {String} storeName store名称
   * @param {Object} data 数据
   */
  update(storeName,data){
    let _this = this;
    return new Promise((resolve,reject) => {
      let store = this.__getStore(storeName);
      let request = store.put(data);
      request.onsuccess = function (event) {
        resolve(data);
      };
      request.onerror = function (event) {
        reject(event);
      }
    });
  }
  clear(storeName){
    return new Promise((resolve,reject) => {
      let store = this.__getStore(storeName);;
      let request = store.clear();
      request.onsuccess = function (event) {
        console.log(`清空${storeName}完成`);
        resolve(event);
      };
      request.onerror = function (event) {
        console.log(`清空${storeName}失败`);
        reject(event);
      }
    });
  }
}









