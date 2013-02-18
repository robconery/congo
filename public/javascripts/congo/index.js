

Congo = new Marionette.Application({
  navHome: function () {
    Congo.router.navigate("", true);
  },
  navDatabase: function (db) {
    db = db || Congo.currentDatabase;
    Congo.router.navigate(db, true);
  },
  navCollection: function (collection) {
    collection = collection || Congo.selectedCollection;
    Congo.router.navigate(Congo.currentDatabase + "/" + collection, true);
  },
  navDocument: function (id) {
    Congo.router.navigate(Congo.currentDatabase + "/" + Congo.selectedCollection + "/" + id, true);
  }
});

Congo.addInitializer(function () {
  //router
  Congo.router = new Congo.Router({controller : new Congo.Controller()});

  //data
  Congo.databases = new Congo.DatabaseCollection();
  Congo.currentCollection = new Congo.MongoCollections();
  Congo.currentDocuments = new Congo.MongoDocuments();

  //views
  Congo.collectionLayout = new Congo.CollectionLayoutView({ collection: Congo.currentCollection });
  Congo.dbLayout = new Congo.DatabaseLayoutView({ collection: Congo.databases });
  Congo.documentLayout = new Congo.DocumentLayoutView({ collection: Congo.currentDocuments })
  Congo.editorView = new Congo.EditorView();

  Congo.AppLayout = Marionette.Layout.extend({
    regions: {
      navigationRegion: "#nav",
      detailRegion: "#details"
    }
  });

  Congo.appLayout = new Congo.AppLayout({ el: "#app" });
  
  //show the crumbs
  Congo.appLayout.navigationRegion.show(new Congo.BreadcrumbView());
  
});

Congo.on("initialize:after", function () {
  //for routing purposes
  Backbone.history.start();
});

Congo.Controller = Marionette.Controller.extend({
  
  setState: function (db, collection, id) {
    if (db) Congo.currentDatabase = db;
    if (collection) Congo.selectedCollection = collection;
    if (id) Congo.selectedDocumentId = id;
  },
  newDocument: function (db, collection) {
    this.setState(db, collection);
    var editorView = new Congo.EditorView({ model: new Congo.MongoDocument() });
    Congo.appLayout.detailRegion.show(editorView);
  },
  showEditor: function (db, collection, id) {
    this.setState(db, collection, id);
    var document = new Congo.MongoDocument({ _id: id });
    document.fetch({
      success: function (model) {
        var editorView = new Congo.EditorView({ model: model });
        Congo.appLayout.detailRegion.show(editorView);
      }
    });
  },
  showDatabase: function (db) {
    this.setState(db);
    Congo.appLayout.detailRegion.show(Congo.collectionLayout);
    Congo.currentCollection.fetch();
  },
  showCollection: function (db, collection) {
    this.setState(db, collection);
    Congo.appLayout.detailRegion.show(Congo.documentLayout);
    Congo.currentDocuments.fetch();
  },
  index: function () {
    Congo.appLayout.detailRegion.show(Congo.dbLayout);
    Congo.databases.fetch();
  }
});

Congo.Router = Marionette.AppRouter.extend({

  appRoutes: {
    "": "index",
    ":db": "showDatabase",
    ":db/:collection": "showCollection",
    ":db/:collection/new": "newDocument",
    ":db/:collection/:id": "showEditor"
  }

});