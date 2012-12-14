var mongo = require("mongoskin");
var _app = {};
var _ = require("underscore")._;

var Congo = function(app){
  var congo = {};

  var connect = function(dbName,next){
    var db = mongo.db("localhost/" + dbName, {safe : true});
    next(db);
  }

  app.post("/mongo-api/query", function(req,res){
    var dbName = req.body.db;
    var collection = req.body.collection;
    var queryText = req.body.query;
    if(queryText.substring(0,1) != "{"){
      queryText = "{" + queryText + "}";
    }
    var query = JSON.parse(queryText);
    connect(dbName, function(db){
      db.collection(collection).find(query).toArray(function(err,response){
        console.log(response);
        res.json(response);
      });    
    })

  });

  app.get("/mongo-api/dbs",function(req,res){
    var out = [];
    connect("admin",function(db){
      db.admin.listDatabases(function(err,result){
        _.each(result.databases,function(item){
          var formatted = {
            name : item.name,
            _url : "http://" + req.headers.host + "/mongo/" + item.name
          };
          out.push(formatted);
        });
        res.json(out);
      });
    });
  });
  app.delete("/mongo-api/dbs/:db",function(req,res){
    var dbName = req.params.db;
    connect(dbName, function(db){
      db.dropDatabase(function(err,result){
        res.json(result);
      });
    });
  });
  app.put("/mongo-api/dbs/:db",function(req,res){
    var dbName = req.params.db;
    connect(dbName, function(db){
      db.createCollection("users",function(err,result){
        res.json({name : dbName});
      });
    });
    
  });

  app.get("/mongo-api/:db",function(req,res){
    var dbName = req.params.db;
    connect(dbName, function(db){
      var out = [];
      db.collectionNames(function(err,collNames){
        _.each(collNames, function(collName){
          var cleanName = collName.name.replace(dbName + ".","");
          var formatted = {
            name : cleanName,
            _url : "http://" + req.headers.host + "/mongo/" + dbName + "/" + cleanName,
            database : dbName
          };
          if(cleanName != "system.indexes")
            out.push(formatted);
        });
        res.json(out);
      });
    });
  });

  app.put("/mongo-api/:db/:collection",function(req,res){
    //adds a collection
    var collectionName = req.params.collection;
    var dbName = req.params.db;
    var out = [];
    connect(dbName, function(db){
      db.createCollection(collectionName, function(err,result){
        res.json({name : collectionName});
      });
    });
  });

  app.get("/mongo-api/:db/:collection",function(req,res){
    var dbName = req.params.db;
    var collName = req.params.collection;
    var out = [];
    connect(dbName, function(db){
      db.collection(collName).find().limit(50).toArray(function(err,items){
        _.each(items,function(item){
          var formatted = item;
        });
      
        res.json(items);
      });
    });
  });

  app.delete("/mongo-api/:db/:collection", function(req,res) {
    var dbName = req.params.db;
    connect(dbName, function(db){
      db.dropCollection(req.params.collection,function(err,result){
        res.json(result);
      });   
    });
  });

  app.delete("/mongo-api/:db/:collection/:id",function(req,res){
    var dbName = req.params.db;
    connect(dbName, function(db){
      db.collection(req.params.collection).removeById(req.params.id,function(err,result){
        res.json(result);
      });
    });
  });
 
  app.post("/mongo-api/:db/:collection",function(req,res){
    var dbName = req.params.db;
    connect(dbName, function(db){
      var doc = req.body;
      db.collection(req.params.collection).insert(doc, function(err,result){
        var out ={error : err, result : result}; 
        res.json(out);
      });
    });
  });
  
  app.put("/mongo-api/:db/:collection/:id",function(req,res){
    var dbName = req.params.db;
    connect(dbName, function(db){
      var doc = req.body;
      delete doc._id;
      db.collection(req.params.collection).updateById(req.params.id, doc, {}, function(err,result){
        var out ={error : err, result : result}; 
        res.json(out);
      });
    });
  });

  congo.app = app;
  return congo;

};

module.exports = Congo;
