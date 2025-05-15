import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/home.tsx"),
  route("brief/:id", "routes/brief/$id.tsx"),
  route("exercise/:id", "routes/exercise/$id.tsx"),
  route("regex-converter", "routes/regex-converter/regex-converter.tsx"),
  route("leftmost-derivation", "routes/leftmost-derivation/leftmost-derivation.tsx"),
] satisfies RouteConfig;
