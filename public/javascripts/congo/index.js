Congo = {
  init: function () {

    //data
    Congo.databases = new Congo.DatabaseCollection();

    //views
    Congo.breadcrumbs = new Congo.BreadcrumbView({ el: "#nav" });

    //start it off
    Congo.start();
  },

  showDatabases: function () {
    var dbLayout = new Congo.DatabaseLayoutView({ collection: Congo.databases });
    dbLayout.render();

    $("#details").append(dbLayout.el);
    Congo.databases.fetch();
  },

  start: function () {
    Congo.showDatabases();
  }
}