'use strict';

module.exports = (html, css) => {
  appendCSS(css);
  return {
    template: html,
    destroyed() {
      this.$parent.$options.$children = this.$parent.$options.$children.filter(el => el !== this);
    },
    created() {
      this.$parent.$options.$children = this.$parent.$options.$children || [];
      this.$parent.$options.$children.push(this);
    }
  };
};

function appendCSS(css) {
  if (!css) {
    return;
  }
  if (typeof document === 'undefined') {
    return;
  }
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  head.appendChild(style);
  style.appendChild(document.createTextNode(css));
}