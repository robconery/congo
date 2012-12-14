Congo.Database = Backbone.Model.extend({
  url: function () {
    return "/mongo-api/dbs/" + this.id;
  },
  idAttribute: "name"
});
Congo.DatabaseCollection = Backbone.Collection.extend({
  model : Congo.Database,
  url: "/mongo-api/dbs"
});
Congo.DatabaseOptionView = Backbone.View.extend({
  initialize: function () {
    this.render();
  },
  events: {
    "submit form": "addDb"
  },
  addDb: function (event) {
    event.preventDefault();
    var newDbName = $("#newDb").val();
    var newDb = new Congo.Database({ name: newDbName });
    newDb.save();
    Congo.databases.add(newDb);
  },
  render: function () {
    var source = $("#new-db-template").html();
    var compiled = _.template(source);
    this.$el.html(compiled);
    return this;
  }
});
Congo.DatabaseView = Backbone.View.extend({
  tagName: "tr",
  events: {
    "click button": "removeDb"
  },
  removeDb: function () {
    var confirmed = confirm("Delete this database? You sure? That sounds crazy...");
    if(confirmed){
      this.model.destroy();
      Congo.databases.remove(this.model);
    }
  },
  render: function () {
    var template = $("#database-list-template").html();
    var compiled = _.template(template, this.model.toJSON());
    this.$el.html(compiled);
    return this;
  }
});

Congo.DatabaseListView = Backbone.View.extend({
  initialize: function () {
    this.collection.bind("reset", this.render, this);
    this.collection.bind("add", this.render, this);
    this.collection.bind("remove", this.render, this);
    this.renderOptionView();
  },
  tagName: "table",
  className: "table table-striped",
  renderOptionView: function () {
    var optionView = new Congo.DatabaseOptionView({ el: "#db-options" });
  },
  render: function () {
    var els = [];
    this.collection.each(function (item) {
      var itemView = new Congo.DatabaseView({ model: item });
      els.push(itemView.render().el);
    });
    this.$el.html(els);
    $("#database-list").append(this.el);
  }
});