Framework.defineResource("MainModel", "model", function(sandbox)
{
    return Backbone.RelationalModel.extend({
        initialize: function(params)
        {
            params = params || {};

            Backbone.RelationalModel.prototype.initialize.apply(this, params);
        },
        getByPath: function(path, defaultValue)
        {
            return Framework.Helpers.ObjectHelper.getPropertyByPath(this.attributes, path, defaultValue);
        }
    });
});