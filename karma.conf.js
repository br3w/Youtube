// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    files: [
      'libs/jquery-1.11.3.min.js',
      'myscript.js',
      'test/**/*.js'
    ]
  });
};
