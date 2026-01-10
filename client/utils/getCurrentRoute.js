const flattenRoutes = (routes) => {
  let flat = [];
  routes.forEach((route) => {
    if (route.route) {
      flat.push(route);
    }
    if (route.collapse) {
      flat = flat.concat(flattenRoutes(route.collapse));
    }
  });
  return flat;
};

const getCurrentRoute = (pathname, routes) => {
  const flatRoutes = flattenRoutes(routes);
  return flatRoutes.filter((r) => pathname.startsWith(r.route));
};

export default getCurrentRoute;