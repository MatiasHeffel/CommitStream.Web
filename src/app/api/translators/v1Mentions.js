"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var v1Mentions = {};

v1Mentions.getWorkitems = function (message) {
  var re = new RegExp("[A-Z,a-z]{1,2}-[0-9]+", "g");
  var matches = message.match(re);
  matches = matches === null ? [] : matches;
  var mentions = [];
  matches.forEach(function (wi) {
    return mentions.push(wi.toUpperCase());
  });
  return mentions;
};

exports["default"] = v1Mentions;
module.exports = exports["default"];
