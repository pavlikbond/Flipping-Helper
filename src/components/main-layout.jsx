import ResponsiveAppBar from "./ResponsiveAppBar";

const MainLayout = ({ children }) => {
  return (
    <>
      <ResponsiveAppBar />
      {children}
    </>
  );
};

export default MainLayout;
