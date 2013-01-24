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

Congo.CollectionView = Congo.ItemView.extend({
  tagName: "tr",
  template: "#collection-list-template",
  events: {
    "click button": "remove",
    "click a": "show"
  },
  show: function (ev) {
    ev.preventDefault();
    var collectionName = $(ev.currentTarget).data("collection");
    Congo.router.navigate(Congo.currentDatabase + "/" + collectionName,true);
    //navigate to documents when we get there
  }
});

Congo.CollectionListView = Congo.ListView.extend({
  tagName: "table",
  className: "table table-striped",
  ItemView : Congo.CollectionView
});

Congo.CollectionOptionView = Congo.View.extend({
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

Congo.CollectionLayoutView = Congo.Layout.extend({
  template: "#collection-details-template",
  regions: {
    collectionList: "#collection-list",
    collectionOptions: "#collection-options"
  },
  layoutReady: function () {
    var collectionListView = new Congo.CollectionListView({ collection: this.collection });
    var optionView = new Congo.CollectionOptionView({});
    this.collectionList.append(collectionListView.render().el);
    this.collectionOptions.append(optionView.render().el);
  }
})