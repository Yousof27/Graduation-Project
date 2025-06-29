import { Outlet } from "react-router-dom";
import Header from "../components/common/header/Header";

function MainPage() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default MainPage;
