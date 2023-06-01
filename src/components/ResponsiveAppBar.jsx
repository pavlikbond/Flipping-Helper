import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
//import TollIcon from "@mui/icons-material/Toll";
import { openPortal } from "@/utils/stripe";
import { useRouter } from "next/navigation";
import { useUser } from "src/components/UserContext";
import Image from "next/image";
const pages = ["home", "pricing", "about", "tracker"];

function ResponsiveAppBar() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { push } = useRouter();
  const { plan } = useUser();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onOpenPortal = async () => {
    let session = await openPortal(window.location, userId);
    push(session.url);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/" className="items-center mr-12 no-underline hidden md:flex">
            {/* <TollIcon className="mr-2" /> */}
            <Image src="/logo.png" width={30} height={30} className="mr-2" alt="logo" />
            <p className="uppercase tracking-wider font-bold">FlipScape Pro</p>
          </Link>

          <Box sx={{ flexGrow: 0.5, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu} className="min-w-[200px]">
                  <Link href={`/${page === "home" ? "" : page}`} passHref>
                    <Typography textAlign="center" className="uppercase font-semibold text-slate-500">
                      {page}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}
              {isLoaded && !userId && (
                <MenuItem onClick={handleCloseNavMenu} className="min-w-[200px]">
                  <div className="flex gap-2">
                    <Link href="/sign-in" passHref className="flex-1">
                      <Button variant="outlined" color="secondary" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/sign-up" passHref className="flex-1">
                      <Button variant="contained" color="secondary" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </MenuItem>
              )}
              {sessionId && (plan === "Pro" || plan === "Basic") && (
                <MenuItem onClick={handleCloseNavMenu} className="min-w-[200px]">
                  <Button variant="outlined" color="secondary" onClick={onOpenPortal}>
                    Manage Subscription
                  </Button>
                </MenuItem>
              )}
            </Menu>
          </Box>
          {/* <TollIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} className="mr-2" /> */}
          <Image src="/logo.png" width={25} height={25} className="mr-2 md:hidden" alt="logo" />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,

              color: "inherit",
              textDecoration: "none",
            }}
          >
            FlipScape Pro
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} className="justify-between">
            <div className="flex gap-1">
              {pages.map((page) => {
                if (!userId && page === "tracker") return null;
                else {
                  return (
                    <Link key={page} href={`/${page === "home" ? "" : page}`}>
                      <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: "white", display: "block" }}>
                        {page}
                      </Button>
                    </Link>
                  );
                }
              })}
            </div>
            {isLoaded && userId && (
              <div className="flex gap-2 items-center mr-4">
                {sessionId && (plan === "Pro" || plan === "Basic") && (
                  <Button variant="outlined" color="secondary" onClick={onOpenPortal}>
                    Manage Subscription
                  </Button>
                )}
              </div>
            )}
            {isLoaded && !userId && (
              <div className="flex gap-2 items-center">
                <Link href="/sign-in" passHref>
                  <Button variant="outlined" color="secondary">
                    Login
                  </Button>
                </Link>
                <Link href="/sign-up" passHref>
                  <Button variant="contained" color="secondary">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </Box>

          <UserButton afterSignOutUrl="/" />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
