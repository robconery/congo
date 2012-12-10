Congo.BreadcrumbView = Backbone.View.extend({
  initialize: function () {
    this.render();
  },
  render: function () {
    $(this.el).append("<li><h3><a href='#'>DATABASES</a></h3></li>");
    return this;
  },
  events: {
    "click a": "sayHello"
  },
  sayHello: function () {
    alert("Hello!");
  }
});