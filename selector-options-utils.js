var fileData = {
  "filename":"file0",
  "option1":[
    {"name":"jack1","value":"1"},
    {"name":"jack2","value":"2"},
    {"name":"jack3","value":"3"}
  ],
  "option2":[
    {"name":"jack12","value":"12"},
    {"name":"jack22","value":"22"},
    {"name":"jack32","value":"32"}
  ]
};
var fileData1 = {
  "filename":"file3",
  "option1":[
    {"name":"jack1","value":"2"},
    {"name":"jack2","value":"2"},
    {"name":"jack3","value":"3"}
  ],
  "option2":[
    {"name":"jack12","value":"12"},
    {"name":"jack22","value":"22"},
    {"name":"jack32","value":"32"}
  ]
};


let dbIns = null;

var initStore = async function(){
  let storeInfo = [
    {
      storeName:"optionsData",
      keyPath:"filename",
      indexs:[
        // {indexName:"name",showName:"name",options:{ unique: false }}
      ]
    }
  ];
  let fileDatas = [fileData,fileData1];
  dbIns = new IndexDB("selectorOptionsDB",2);
  await dbIns.createObjectStore(storeInfo);
  await dbIns.clear("optionsData");
  for(let i=0;i<fileDatas.length;i++){
    try{
      await dbIns.update("optionsData",fileDatas[i]);
    }catch(e){
      console.log("增加失败",fileDatas[i])
    }
  }
  return dbIns;
}

async function  func(filename,optionName){
  let dbIns = await initStore();
  let result = await dbIns.selectById("optionsData",filename);
  console.log("获取到下拉框::",result[optionName])
  return result[optionName];
}
var a = func("file3","option1");
