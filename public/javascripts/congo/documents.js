Congo.MongoDocument = Backbone.Model.extend({
  idAttribute: "_id",
  url: function () {
    var baseUrl = "/mongo-api/" + Congo.currentDatabase + "/" + Congo.selectedCollection;
    if (this.isNew()) {
      return baseUrl;
    } else {
      return baseUrl + "/" + this.id;
    }
  },
  setSelected: function (id) {
    this.set({ _id: id }, { silent: true });
    //set it off
    console.log("FETCHING")
    this.fetch();
  },
  descriptor: function () {
    if (this.get("name"))
      return this.get("name");
    if (this.get("sku"))
      return this.get("sku");
    if (this.get("slug"))
      return this.get("slug");
    else if (this.get("title"))
      return this.get("title");
    else if (this.get("email"))
      return this.get("email");
    else
      return this.get("_id");
  }
});

Congo.MongoDocuments = Backbone.Collection.extend({
  model: Congo.MongoDocument,
  url : function(){
    return "/mongo-api/" + Congo.currentDatabase + "/" + Congo.selectedCollection
  }
});

Congo.EditorView = Marionette.ItemView.extend({
  template: "#editor-template",
  events: {
    "click #save-document": "saveDocument",
    "click #delete-document": "deleteDocument"
  },
  saveDocument: function () {
    var json = this.editor.getValue();
    try {
      var parsed = JSON.parse(json);
      var newDocument = new Congo.MongoDocument(parsed);
      newDocument.save(newDocument.attributes, {
        success: function (model, result) {
          Congo.navCollection();
          $("#app").effect("highlight");
        },
        error: function (model, result) {
          alert("We have a JSON problem");
        }
      });
    } catch (err) {
      alert("We have a JSON problem: " + err);
    }
  },
  deleteDocument: function () {
    if (confirm("Delete this document? Are you sure?")) {
      this.model.destroy();
      //navigate back to users
      Congo.navCollection();
    };
  },
  onShow: function () {

    this.editor = ace.edit("ace-editor");
    var JsonMode = require("ace/mode/json").Mode;
    this.editor.getSession().setMode(new JsonMode());

    this.model = this.model || new Congo.MongoDocument();

    var docJSON = JSON.stringify(this.model.toJSON(), null, '  ');
    this.editor.setValue(docJSON);
    this.editor.selection.clearSelection();
  }
});

Congo.DocumentView = Marionette.ItemView.extend({
  template: "#document-item-template",
  className : "document pull-left",
  events: {
    "click a": "showDocument"
  },

  showDocument: function (ev) {
    ev.preventDefault();
    Congo.navDocument(this.model.id);
  },
  render: function () {
    var source = $(this.template).html();
    var data = { descriptor: this.model.descriptor() };
    var compiled = _.template(source, data);
    this.$el.html(compiled);
    return this;
  }
});

Congo.DocumentListView = Marionette.CollectionView.extend({
  itemView : Congo.DocumentView
});

Congo.DocumentOptionView = Marionette.ItemView.extend({
  initialize: function () {
    this.render();
  },
  template: "#new-document-template",
  events: {
    "click button": "addDocument"
  },
  addDocument: function (event) {
    Congo.navDocument("new");
  }
});

Congo.DocumentLayoutView = Marionette.Layout.extend({
  template: "#document-details-template",
  regions: {
    documentList: "#document-list",
    documentOptions: "#document-options"
  },
  onRender: function () {
    var documentListListView = new Congo.DocumentListView({ collection: this.collection });
    var optionView = new Congo.DocumentOptionView({});
    this.documentList.show(documentListListView);
    this.documentOptions.show(optionView);
  }
})