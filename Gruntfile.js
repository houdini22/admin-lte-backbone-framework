var config = {
    js_src: "src/js/",
    js_compile_dir: "src/js/_compiled/",
    //
    js_dest: "public/assets/js/",
    //////////////////////////////
    _src: "src/",
    _dest: "public/assets/",
    //////////////////////////////
    css_src: "src/css/",
    css_sass_dir: "src/css/sass/",
    css_sass_compile_dir: "src/css/sass/_compiled",
    css_compile_dir: "src/css/_compiled/",
    //
    css_dest: "public/assets/css/",
    //////////////////////////////
    img_src: "src/img/",
    img_dest: "public/assets/img/"
    //////////////////////////////
};

module.exports = function(grunt)
{
    /*  Load tasks  */
    require("load-grunt-tasks")(grunt);

    /*  Configure project  */
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        // Setup tasks
        compass: require("./tasks/compass")(config),
        concat: require("./tasks/concat")(config),
        cssmin: require("./tasks/cssmin")(config),
        copy: require("./tasks/copy")(config),
        uglify: require("./tasks/uglify")(config),
        clean: require("./tasks/clean")(config),
        watch: require("./tasks/watch")(config)
    });

    /*  Register tasks  */
    grunt.registerTask("default", ["clean", "copy:img", "copy:fonts", "copy:vendor", "compass:build", "concat:buildCSS", "cssmin:minify", "concat:buildJS", "uglify:minify", "copy:prodConfig"]);
    grunt.registerTask("dev", ["clean", "copy:img", "copy:fonts", "copy:vendor", "compass:build", "concat:buildCSS", "cssmin:minify", "concat:buildJS", "copy:devJS", "copy:devConfig"]);
    grunt.registerTask("listen", ["watch"]);
};
