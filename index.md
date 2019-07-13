```js
// 判断是否存在表  
db.objectStoreNames.contains('person') 
//创建表
objectStore = db.createObjectStore('person', { keyPath: 'id' }); 
//创建表
var objectStore = db.createObjectStore('person',{ autoIncrement: true }); 
//创建索引
objectStore.createIndex('name', 'name', { unique: false }); 
//新增数据
var request = db.transaction(['person'], 'readwrite')
  .objectStore('person')
  .add({ id: 1, name: '张三', age: 24, email: 'zhangsan@example.com' });
request.onsuccess = function (event) {
  console.log('数据写入成功');
  };
request.onerror = function (event) {
  console.log('数据写入失败');
}
//读取数据
function read() {
   var transaction = db.transaction(['person']);
   var objectStore = transaction.objectStore('person');
   var request = objectStore.get(1);

   request.onerror = function(event) {
     console.log('事务失败');
   };

   request.onsuccess = function( event) {
      if (request.result) {
        console.log('Name: ' + request.result.name);
        console.log('Age: ' + request.result.age);
        console.log('Email: ' + request.result.email);
      } else {
        console.log('未获得数据记录');
      }
   };
}
//读取全部
function readAll() {
  var objectStore = db.transaction('person').objectStore('person');

   objectStore.openCursor().onsuccess = function (event) {
     var cursor = event.target.result;

     if (cursor) {
       console.log('Id: ' + cursor.key);
       console.log('Name: ' + cursor.value.name);
       console.log('Age: ' + cursor.value.age);
       console.log('Email: ' + cursor.value.email);
       cursor.continue();
    } else {
      console.log('没有更多数据了！');
    }
  };
}
//更新
function update() {
  var request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .put({ id: 1, name: '李四', age: 35, email: 'lisi@example.com' });

  request.onsuccess = function (event) {
    console.log('数据更新成功');
  };

  request.onerror = function (event) {
    console.log('数据更新失败');
  }
}
//删除
function remove() {
  var request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .delete(1);

  request.onsuccess = function (event) {
    console.log('数据删除成功');
  };
}
//索引
objectStore.createIndex('name', 'name', { unique: false });
//现在，就可以从name找到对应的数据记录了。


var transaction = db.transaction(['person'], 'readonly');
var store = transaction.objectStore('person');
var index = store.index('name');
var request = index.get('李四');

request.onsuccess = function (e) {
  var result = e.target.result;
  if (result) {
    // ...
  } else {
    // ...
  }
}


```