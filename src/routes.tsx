import { createBrowserRouter } from "react-router";
import { Welcome } from "./routes/welcome/welcome";
import App from "./App";
import RegexConverter from "./routes/regex-converter/regex-converter";
import Brief from "./routes/brief/$id";
import Exercise from "./routes/exercise/$id";
import LeftMostDerivation from "./routes/leftmost-derivation/leftmost-derivation";
import RegexGrammer from "./routes/regex-grammer/regex-grammer";

const router = createBrowserRouter([
  {
    path: "/Compiler-Helper/",
    element: <App />,
    children: [
      { index: true, element: <Welcome /> },
      { path: 'brief/:id', element: <Brief /> },
      { path: 'exercise/:id', element: <Exercise /> },
      { path: 'regex-converter', element: <RegexConverter /> },
      { path: 'leftmost-derivation', element: <LeftMostDerivation /> },
      { path: 'regex-grammer', element: <RegexGrammer /> },
    ],
  },
]);

export default router;