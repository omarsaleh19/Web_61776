import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { ThemeContext } from "./ThemeContext"; // Import ThemeContext

const Carousel = () => {
  const { theme } = useContext(ThemeContext); // Access theme from context
  const currency = "USD";
  const symbol = "$";
  const [trending, setTrending] = useState([]);
  const [autoplayInterval, setAutoplayInterval] = useState(1500); // Default autoplay interval

  const fetchTrendingCoins = async () => {
    try {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets`,
        {
          params: {
            vs_currency: currency,
            order: "gecko_desc",
            per_page: 10,
            page: 1,
            sparkline: false,
            price_change_percentage: "24h",
          },
        }
      );
      setTrending(data);
    } catch (error) {
      console.error("Error fetching trending coins: ", error);
    }
  };

  useEffect(() => {
    fetchTrendingCoins();

    // Adjust autoplay speed based on screen size
    const handleResize = () => {
      if (window.innerWidth < 512) {
        setAutoplayInterval(2500); // Slower autoplay on small screens
      } else {
        setAutoplayInterval(1500); // Default speed for larger screens
      }
    };

    window.addEventListener("resize", handleResize);

    // Set initial autoplay speed based on current screen size
    handleResize();

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [currency]);

  const items = trending.map((coin) => {
    let profit = coin?.price_change_percentage_24h >= 0;

    return (
      <div
        key={coin.id}
        className={`flex flex-col items-center justify-center space-x-0 sm:space-x-4 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        <img
          src={coin?.image}
          alt={coin.name}
          className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 mb-2 object-contain"
        />
        <span className="uppercase">
          {coin?.symbol.toUpperCase()} &nbsp;
          <span
            className={`font-semibold ${
              profit ? "text-green-500" : "text-red-500"
            }`}
          >
            {profit && "+"}
            {coin?.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </span>
        <span className="text-lg font-semibold">
          {symbol} {coin?.current_price.toFixed(2)}
        </span>
      </div>
    );
  });

  const responsive = {
    0: {
      items: 2, // Show 2 items on small screens
    },
    512: {
      items: 3, // Show 3 items on medium screens
    },
    1024: {
      items: 5, // Show 5 items on large screens
    },
  };

  return (
    <div className="py-10 overflow-hidden">
      <div className="container mx-auto px-4">
        <AliceCarousel
          mouseTracking
          infinite
          autoPlay
          autoPlayInterval={autoplayInterval}
          animationDuration={1000}
          disableDotsControls
          disableButtonsControls
          responsive={responsive}
          items={items}
        />
      </div>
    </div>
  );
};

export default Carousel;
