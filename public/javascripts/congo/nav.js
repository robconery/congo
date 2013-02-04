Congo.BreadcrumbView = Backbone.View.extend({
  initialize: function () {
    Congo.router.on("route:index", this.renderIndex, this);
    Congo.router.on("route:showDatabase", this.renderDatabase, this);
    Congo.router.on("route:showCollection", this.renderCollection, this);
    Congo.router.on("route:showEditor", this.renderEditor, this);
    Congo.router.on("route:newDocument", this.renderNewDocument, this);
  },

  //The only reason I chose to put this here is because
  //the amount of templates drives me crazy
  crumb: function (caption, addSeparator) {
    var crumb = "<li><h3>" + caption + "</h3></li>";
    if (addSeparator) {
      crumb = crumb + this.crumbSeparator();
    }
    return crumb;
  },

  crumbWithLink: function (caption, id, addSeparator) {
    var crumb = "<li><h3><a href='#' id='" + id + "'>" + caption + "</a>";
    if (addSeparator) {
      crumb = crumb + this.crumbSeparator();
    }
    return crumb;
  },
  crumbSeparator: function () {
    return "<span class='divider'>/</span></h3></li>";
  },

  //no repeats!
  showHomeLink: function () {
    this.$el.append(this.crumbWithLink("DATABASES", "navIndex", true));
  },
  showDbLink: function (db) {
    this.$el.append(this.crumbWithLink(db, "db-details", true));
  },
  showCollectionLink: function (collection) {
    this.$el.append(this.crumbWithLink(collection, "collection-details", true));
  },
  renderIndex: function () {
    this.$el.empty();
    $(this.el).append(this.crumb("DATABASES"));
    return this;
  },
  renderDatabase: function (db) {
    this.$el.empty();
    this.showHomeLink();
    this.$el.append(this.crumb(db));
    return this;
  },
  renderCollection: function (db, collection) {
    this.$el.empty();
    this.showHomeLink();
    this.showDbLink(db);
    this.$el.append(this.crumb(collection));
    return this;
  },
  renderEditor: function (db, collection, id) {
    this.$el.empty();
    this.showHomeLink();
    this.showDbLink(db);
    this.showCollectionLink(collection);
    this.$el.append(this.crumb(id));
  },
  renderNewDocument: function (db, collection, id) {
    this.$el.empty();
    this.showHomeLink();
    this.showDbLink(db);
    this.showCollectionLink(collection);
    this.$el.append(this.crumb("NEW"));
  },
  events: {
    "click #summary": "navIndex",
    "click #db-details": "navDb",
    "click #collection-details": "navCollection"
  },
  navCollection: function (ev) {
    ev.preventDefault();
    Congo.navCollection();

  },
  navDb: function (ev) {
    ev.preventDefault();
    Congo.navDatabase();
  },
  navIndex: function (ev) {
    ev.preventDefault();
    Congo.navHome();
  }
});