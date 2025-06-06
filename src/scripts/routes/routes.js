import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import DetailPage from "../pages/detail/detail-page";
import AddStoryPage from "../pages/add/add-story-page";
import LoginPage from "../pages/login/login-page";
import RegisterPage from "../pages/register/register-page";
import OfflinePage from "../pages/offline/offline-page";
import NotFoundPage from "../pages/offline/not-found-page";

const routes = {
  "/": new HomePage(),
  "/about": new AboutPage(),
  "/detail/:id": new DetailPage(),
  "/add": new AddStoryPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  '/offline': OfflinePage,
  '/not-found': NotFoundPage
};

export default routes;
