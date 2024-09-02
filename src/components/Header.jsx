import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MagnifyingGlassIcon,
  GearIcon,
  ExitIcon,
  BellIcon,
} from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { ThemeToggler } from "./ThemeToggler";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { checkUser, logout } from "../features/userSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Header() {
  const [query, setQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkUser());
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      dispatch(logout());
      navigate("/login");
      toast.success("Logout successful.");
    } catch (error) {
      toast.error("An error occurred while logging out.");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim() === "") {
      toast.error("Search query cannot be empty!");
      return;
    }

    try {
      const response = await axios.get(`/api/search?query=${query}`);
      if (response.data.length === 0) {
        toast.error("We didn't find your book.");
      } else {
        toast.success(`Found ${response.data.length} books!`);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const totalCartPrice = cartItems
    .reduce((acc, item) => acc + item.price, 0)
    .toFixed(2);

  return (
    <header className="shadow-sm py-5 relative">
      <div className="container flex items-center justify-between px-5">
        <span className="block font-medium text-xl">Book Store</span>
        <form
          onSubmit={handleSearch}
          className="hidden sm:flex items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Search books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button type="submit" className="p-2">
            <MagnifyingGlassIcon className="w-6 h-6" />
          </Button>
        </form>
        <div className="flex items-center space-x-4">
          {/* Theme Toggler */}
          <ThemeToggler />

          {/* Cart with Icon and Badge */}
          <div className="relative">
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="outline"
              size="icon"
              className="relative z-10"
            >
              <BellIcon className="w-4 h-4" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Button>
            {isModalOpen && (
              <Dialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                className="absolute right-0 top-10 w-80 bg-white shadow-lg"
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Your Cart</DialogTitle>
                    <DialogDescription>
                      Here are the books in your cart.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col space-y-4 p-4">
                    {cartItems.length === 0 ? (
                      <p>Your cart is empty.</p>
                    ) : (
                      cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.title}</span>
                          <span>${item.price.toFixed(2)}</span>
                        </div>
                      ))
                    )}
                    <div className="mt-4 font-semibold text-lg">
                      Total Price: ${totalCartPrice}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setIsModalOpen(false)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {user ? `Welcome, ${user.name}` : "Settings"}
                <GearIcon className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user ? (
                <>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout <ExitIcon className="mr-2" />
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => navigate("/login")}>
                  Login
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
