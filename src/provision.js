/**
 * Provision.js v0.1.2 - A conditional require.js loader plugin.
 *
 * This plugin evaluates tests for each configured module and loads them only if
 * those tests pass. If a test fails, it does not load and does not execute the
 * module and returns undefined as the value for that module.
 *
 * All tests should be placed in the "provision" object of requirejs.config()
 * as objects.
 *
 * @example
 * requirejs.config({
 *   "provision": {
 *     "myModule": {
 *       "build": false, // Instructs the optimizer to skip the module
 *       "test": window.matchMedia && window.addEventListener // Only load if true
 *     }
 *   }
 * });
 */
define(['module'], function(module, undefined) {

  var provision = {
    version: '0.1.0',
  };

  provision.load = function(name, req, onload, config) {
    if (!config.isBuild) {

      // Check if there are tests to evaluate
      var result = this.test(name, config);
      if (result) {
        req([name], function(value) {
          onload(value);
        });
      }
      else {
        onload();
      }

    }
    else {
      // Running in a build environment.
      var shouldBuild = this.shouldBuild(name, config);
      if (shouldBuild) {
        req([name], function(value) {
          onload(value);
        });
      }
      else {
        onload();
      }
    }
  };

  provision.test = function(name, config) {
    var result = false;

    // Check if there are tests to evaluate
    if (config.provision !== undefined &&
        config.provision[name] !== undefined &&
        config.provision[name].test !== undefined) {
      var test = config.provision[name].test;
      result = typeof test === 'function' ? test.apply(this) : !!test;
    }

    return result;
  };

  provision.shouldBuild = function(name, config) {
    return config.provision !== undefined &&
           config.provision[name] !== undefined &&
           config.provision[name].build !== undefined ? config.provision[name].build : true;
  };

  return provision;
});
