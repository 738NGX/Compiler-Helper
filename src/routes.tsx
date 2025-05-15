import { createBrowserRouter } from "react-router";
import { Welcome } from "./routes/welcome/welcome";
import App from "./App";
import RegexConverter from "./routes/regex-converter/regex-converter";
import Brief from "./routes/brief/$id";
import Exercise from "./routes/exercise/$id";
import LeftMostDerivation from "./routes/leftmost-derivation/leftmost-derivation";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Welcome /> },
      { path: 'brief/:id', element: <Brief /> },
      { path: 'exercise/:id', element: <Exercise /> },
      { path: 'regex-converter', element: <RegexConverter /> },
      { path: 'leftmost-derivation', element: <LeftMostDerivation /> },
    ],
  },
]);

export default router;