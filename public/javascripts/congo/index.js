Congo = {
  init: function () {
    //router
    Congo.router = new Congo.Router();

    //data
    Congo.databases = new Congo.DatabaseCollection();
    Congo.currentCollection = new Congo.MongoCollections();
    Congo.currentDocuments = new Congo.MongoDocuments();

    //views
    Congo.breadcrumbs = new Congo.BreadcrumbView({ el: "#nav" });
    Congo.collectionLayout = new Congo.CollectionLayoutView({ collection: Congo.currentCollection });
    Congo.dbLayout = new Congo.DatabaseLayoutView({ collection: Congo.databases });
    Congo.documentLayout = new Congo.DocumentLayoutView({ collection: Congo.currentDocuments })
    
    //the App Layout
    Congo.appLayout = new Congo.AppLayout({
      el: "#app",
      detailRegion: "#details",
      editorRegion: "#editor",
      navigatorView: Congo.breadcrumbs
    })
  },

  start: function () {
    //intialize the app
    Congo.init();

    //for routing purposes
    Backbone.history.start();
  }
}

Congo.Router = Backbone.Router.extend({
  routes: {
    "": "index",
    ":db": "showDatabase",
    ":db/:collection": "showCollection",
    ":db/:collection/:id": "showEditor"
  },
  showEditor: function (db, collection, id) {
    Congo.currentDatabase = db;
    Congo.selectedCollection = collection;
    Congo.selectedDocumentId = id;
    Congo.appLayout.renderEditor({message : "Hello!"});
  },
  showDatabase: function (db) {
    Congo.currentDatabase = db;
    Congo.appLayout.renderDetails(Congo.collectionLayout);
    Congo.currentCollection.fetch();
  },
  showCollection: function (db, collection) {
    Congo.selectedCollection = collection;
    Congo.currentDatabase = db;
    Congo.appLayout.renderDetails(Congo.documentLayout);
    Congo.currentDocuments.fetch();
  },
  index: function () {
    Congo.appLayout.renderDetails(Congo.dbLayout);
    Congo.databases.fetch();
  }
});