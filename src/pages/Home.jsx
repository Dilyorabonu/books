import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { axiosClient } from "../utils/axiosClient";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function Home() {
  const titleRef = useRef();
  const priceRef = useRef();
  const { user } = useSelector((state) => state.user);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (user) {
      axiosClient
        .get("/books")
        .then((response) => {
          setBooks(response.data.data);
        })
        .catch((error) => console.log(error));
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = titleRef.current.value;
    const price = parseFloat(priceRef.current.value); // Convert to number

    if (title && !isNaN(price)) {
      axiosClient
        .post("/books", { title, price })
        .then((response) => {
          setBooks([...books, response.data]);
          titleRef.current.value = "";
          priceRef.current.value = "";
          toast.success("Book added successfully!");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to add book.");
        });
    }
  };

  const handleDelete = (id) => {
    axiosClient
      .delete(`/books/${id}`)
      .then(() => {
        setBooks(books.filter((book) => book.id !== id));
        toast.success("Book deleted successfully!");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to delete book.");
      });
  };

  const handleBuy = (book) => {
    // Get current cart items from local storage
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Add the new book to the cart
    const updatedCartItems = [...cartItems, book];
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

    // Show toast notification
    toast.success(`You bought "${book.title}"!`);

    // Update the cart badge in the Header
    const bellIconBadge = document.querySelector("header .relative .absolute");
    if (bellIconBadge) {
      bellIconBadge.textContent = updatedCartItems.length;
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card className="mb-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Add a New Book</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              ref={titleRef}
              placeholder="Book Title"
              variant="outline"
              className="w-full"
            />
            <Input
              type="number"
              ref={priceRef}
              placeholder="Book Price"
              variant="outline"
              className="w-full"
            />
            <Button type="submit" className="w-full text-white rounded-md py-2">
              Add Book
            </Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4 text-center">Existing Books</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book) => (
          <Card
            key={book.id}
            className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="relative">
              <img
                src={book.coverUrl || "/placeholder-image.jpg"}
                alt={book.title}
                className="w-full h-56 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-70 rounded-full px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 shadow-lg">
                ${book.price.toFixed(2)}
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 space-y-2">
              <CardTitle className="font-bold text-lg text-gray-900 dark:text-gray-100">
                {book.title}
              </CardTitle>
              {book.author ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  by {book.author}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Author: Not provided
                </p>
              )}
              <div className="flex items-center space-x-2 mt-1">
                <StarIcon className="w-4 h-4 text-yellow-400" />
                {book.rating ? (
                  <>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {book.rating}
                    </span>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Rating: Not provided
                  </p>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  ({book.stock || "No"} in stock)
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {book.genre || "No genre available."} &middot;{" "}
                {book.pages || "No"} pages
              </p>
              {book.publication_date ? (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Published by {book.publisher} on{" "}
                  {new Date(book.publication_date).toLocaleDateString()}
                </p>
              ) : (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Publication Date: Not provided
                </p>
              )}
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-3">
                {book.description || "No description available."}
              </p>
            </CardContent>
            <CardFooter className="p-4 bg-gray-100 dark:bg-gray-900 gap-3">
              <Button
                onClick={() => handleBuy(book)}
                variant="outline"
                className="w-full text-sm font-semibold"
              >
                Buy
              </Button>
              <Button
                onClick={() => handleDelete(book.id)}
                variant="submit"
                className="w-full bg-red-500 text-white rounded-md py-2"
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Home;
