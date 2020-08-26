module.exports = Object.freeze({
  obj: {
    removeEmptyKey,
  }
});

function removeEmptyKey(obj) {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') removeEmptyKey(obj[key]);
    else if (obj[key] === undefined) delete obj[key];
  });
  return obj;
};