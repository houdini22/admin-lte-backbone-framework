module.exports = function(config)
{
    return {
        build: {
            options: {
                sassDir: config.css_sass_dir,
                cssDir: config.css_sass_compile_dir,
                environment: "development",
                imagesDir: config.img_dest,
                httpImagesPath: "/assets/img",
                httpGeneratedImagesPath: "/assets/img/sprites",
                generatedImagesDir: "public/assets/img/sprites",
                generatedImagesPath: "public/assets/img/sprites"
            }
        }
    }
};
