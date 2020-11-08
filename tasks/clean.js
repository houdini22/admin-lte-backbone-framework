module.exports = function(paths)
{
    return {
        clean: [
            paths._dest + "/*",
            paths.css_sass_compile_dir + "/*.css",
            paths.css_compile_dir + "/*.css",
            paths.js_compile_dir + "/*.js"
        ]
    }
};