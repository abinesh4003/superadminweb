export const privilegesToArray = (constantsObj) => {
  const privileges = Object.entries(constantsObj)
    .map(([key, value]) => {
      if (key === 'PATH') {
        return;
      }

      return value;
    })
    .filter(item => !!item);

  if (!privileges.length) {
    return [false];
  }

  return privileges;
};

export const formatPrivilegesKeys = (constants) => {
  const obj = {};
  const prefix = constants.PATH;

  if (!prefix) {
    return constants;
  }

  Object.entries(constants)
    .filter(([key]) => key !== 'PATH')
    .map(([key, value]) => {
    obj[`${prefix}.${key}`] = value;
  });

  return obj;
};
