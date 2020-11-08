Framework.Helpers["ObjectHelper"] = {
    getPropertyByPath: function(obj, path, defaultValue)
    {
        var arr = path.split("."),
            i;
        if(typeof defaultValue === "undefined")
        {
            defaultValue = null;
        }
        for(i = 0; i < arr.length; i += 1)
        {
            obj = obj[arr[i]];
            if(typeof obj === "undefined")
            {
                return defaultValue;
            }
        }
        return obj;
    },
    setPropertyByPath: function(obj, path, value)
    {
        var arr = path.split('.');
        var result = obj;
        for(var i = 0; i < arr.length - 1; i++)
        {
            var n = arr[i];
            if(n in result)
            {
                result = result[n];
            }
            else
            {
                result[n] = {};
                result = result[n];
            }
        }
        result[arr[arr.length - 1]] = value;
    }
};