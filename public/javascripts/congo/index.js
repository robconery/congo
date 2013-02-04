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
    Congo.editorView = new Congo.EditorView({el : "#editor"});
    
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
  },

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
}

Congo.Router = Backbone.Router.extend({
  routes: {
    "": "index",
    ":db": "showDatabase",
    ":db/:collection": "showCollection",
    ":db/:collection/new": "newDocument",
    ":db/:collection/:id": "showEditor"
  },
  setState: function (db, collection, id) {
    if (db) Congo.currentDatabase = db;
    if (collection) Congo.selectedCollection = collection;
    if (id) Congo.selectedDocumentId = id;
  },
  newDocument: function (db, collection) {
    this.setState(db, collection);
    Congo.appLayout.renderEditor();
  },

  showEditor: function (db, collection, id) {
    this.setState(db, collection, id);
    var document = new Congo.MongoDocument({ _id: id });
    document.fetch({
      success: function (model) {
        Congo.appLayout.renderEditor(model);
      }
    });
  },
  showDatabase: function (db) {
    this.setState(db);
    Congo.appLayout.renderDetails(Congo.collectionLayout);
    Congo.currentCollection.fetch();
  },
  showCollection: function (db, collection) {
    this.setState(db, collection);
    Congo.appLayout.renderDetails(Congo.documentLayout);
    Congo.currentDocuments.fetch();
  },
  index: function () {
    Congo.appLayout.renderDetails(Congo.dbLayout);
    Congo.databases.fetch();
  }
});