Congo.MongoCollection = Backbone.Model.extend({
  url : function(){
    return "/mongo-api/" + Congo.currentDatabase + "/" + this.id;
  },
  idAttribute : "name"
});

Congo.MongoCollections = Backbone.Collection.extend({
  model: Congo.MongoCollection,
  url: function () {
    var url = "/mongo-api/" + Congo.currentDatabase;
    return url;
  }
});

Congo.CollectionView = Marionette.ItemView.extend({
  tagName: "tr",
  template: "#collection-list-template",
  events: {
    "click button": "removeCollection",
    "click a": "showCollection"
  },
  removeCollection: function () {
    var confirmed = confirm("Delete this? You sure?");
    if (confirmed) {
      this.model.destroy();
    }
  },
  showCollection: function (ev) {
    ev.preventDefault();
    var collectionName = $(ev.currentTarget).data("collection");
    Congo.navCollection(collectionName);
  }
});

Congo.CollectionListView = Marionette.CollectionView.extend({
  tagName: "table",
  className: "table table-striped",
  itemView : Congo.CollectionView
});

Congo.CollectionOptionView = Marionette.ItemView.extend({
  initialize: function () {
    this.render();
  },
  template : "#new-collection-template",
  events: {
    "submit form": "addCollection"
  },
  addCollection: function (event) {
    event.preventDefault();
    var newCollectionName = $("#newCollection").val();
    var newCollection = new Congo.MongoCollection({ name: newCollectionName });
    newCollection.save();
    Congo.currentCollection.add(newCollection);
  }
});

Congo.CollectionLayoutView = Marionette.Layout.extend({
  template: "#collection-details-template",
  regions: {
    collectionList: "#collection-list",
    collectionOptions: "#collection-options"
  },
  onRender: function () {
    var collectionListView = new Congo.CollectionListView({ collection: this.collection });
    var optionView = new Congo.CollectionOptionView({});
    this.collectionList.show(collectionListView);
    this.collectionOptions.show(optionView);
  }
})