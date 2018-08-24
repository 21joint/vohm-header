module.exports = function(content) {
  var el = document.createElement('div');
  el.innerHTML = content;
  document.body.appendChild(el);
};
