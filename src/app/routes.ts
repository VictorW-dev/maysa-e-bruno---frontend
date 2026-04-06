import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/upload",
    Component: Upload,
  },
  {
    path: "/gallery",
    Component: Gallery,
  },
  {
    path: "/admin",
    Component: Admin,
  },
]);
