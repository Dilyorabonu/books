import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

function MainLayout() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
