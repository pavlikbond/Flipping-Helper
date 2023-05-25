import { useEffect, useState } from "react";
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
import TollIcon from "@mui/icons-material/Toll";
import { useRouter } from "next/navigation";
import { useUser } from "src/components/UserContext";

const pages = ["home", "pricing", "about"];

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

  const openPortal = () => {
    fetch("/api/stripe/portal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        returnURL: `${window.location}`,
      }),
    })
      .then((res) => res.json())
      .then((session) => {
        // Redirect to Checkout
        push(session.url);
      });
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/" className="items-center mr-12 no-underline hidden md:flex">
            <TollIcon className="mr-2" />
            <p className="uppercase tracking-wider font-bold">FlipScape Pro</p>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <TollIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} className="mr-2" />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            FlipScape Pro
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link key={page} href={`/${page === "home" ? "" : page}`} className="no-underline">
                <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: "white", display: "block" }}>
                  {page}
                </Button>
              </Link>
            ))}
          </Box>
          {isLoaded && !userId && (
            <div className="flex gap-2">
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
          {isLoaded && userId && (
            <div className="flex gap-2">
              {(plan === "Pro" || plan === "Basic") && (
                <Button variant="outlined" color="secondary" onClick={openPortal}>
                  Manage Subscription
                </Button>
              )}
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
