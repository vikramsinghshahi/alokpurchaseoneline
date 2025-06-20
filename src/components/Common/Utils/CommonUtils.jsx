export function selectDotNotation(data, accessor) {
  return accessor.split('.').reduce((obj, split) => obj && obj[split], data);
}

export function isObject(object) {
  if (typeof object === 'object' && object !== null) {
    return true;
  }
  return false;
}
