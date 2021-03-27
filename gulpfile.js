const gulp = require('gulp');
const gulpShell = require('gulp-shell');
const workboxBuild = require('workbox-build');

gulp.task('hugo-build', gulpShell.task(['hugo --minify']));

gulp.task('generate-service-worker', () => {
    return workboxBuild.generateSW({
        globDirectory: 'public',
        globPatterns: ['index.html','404.html','**/*.{css,svg}','fonts/*.woff2'],
        swDest: 'public/sw.js',
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globStrict: true,
        inlineWorkboxRuntime: false,
        mode: 'production',
        runtimeCaching: [
            {
                urlPattern: /\/katex\/fonts\/.*\.(ttf|woff|woff2)$/,
                handler: 'NetworkOnly',
            },
            {
                urlPattern: /\/katex\/katex\.min\.js/,
                handler: 'NetworkOnly',
            },
            {
                urlPattern: /\/mermaid.min.js/,
                handler: 'NetworkOnly',
            },
            {
                urlPattern: /\.(?:html)$/,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'wiki-html-cache',
                },
            },
            {
                urlPattern: /\.(?:png|jpg|jpeg|gif|bmp|webp|ico)$/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'wiki-image-cache',
                    expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 7 * 24 * 60 * 60,
                    },
                },
            },
            {
                urlPattern: /\.(?:js)$/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'wiki-js-cache',
                    expiration: {
                        maxAgeSeconds: 7 * 24 * 60 * 60,
                    },
                },
            },
            {
                urlPattern: /\.(?:json|xml)$/,
                handler: 'NetworkOnly',
            }
        ],
    });
});

gulp.task('build', gulp.series('hugo-build', 'generate-service-worker'));
