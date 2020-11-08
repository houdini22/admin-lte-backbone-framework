/**
 * Define Backbone resource.
 * @param name
 * @param type
 * @param fn
 */
Framework.defineResource = function(name, type, fn)
{
    if(Framework.Resources[name])
    {
        throw "Resource '" + name + "' already exists!";
    }

    Framework.Resources[name] = {
        name: name,
        type: type,
        fn: fn
    };
};