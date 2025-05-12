import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/home.tsx"),
  route("regex-converter","routes/regex-converter/regex-converter.tsx"),
] satisfies RouteConfig;
