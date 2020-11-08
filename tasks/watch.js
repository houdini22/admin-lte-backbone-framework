module.exports = function(paths)
{
    return {
        global: {
            files: [
                paths.js_src + "app/**",
                paths.js_src + "libs/**",
                paths.js_src + "config-dev.js",
                paths.js_src + "config-prod.js",
                paths.css_sass_dir + "**/*.scss",
                paths.css_src + "vendor/**/*.css"
            ],
            tasks: ["clean", "copy:img", "copy:fonts", "copy:vendor", "compass:build", "concat:buildCSS", "cssmin:minify", "concat:buildJS", "copy:devJS", "copy:devConfig"]
        }
    }
};