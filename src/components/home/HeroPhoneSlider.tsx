import { useState, useEffect } from "react";
import phoneMockup1 from "@/assets/phone-mockup-1.png";
import phoneMockup2 from "@/assets/phone-mockup-2.png";
import { Phone } from "lucide-react";

const slides = [phoneMockup1, phoneMockup2];

const HeroPhoneSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex justify-center lg:justify-end">
      <div className="relative w-80 sm:w-96 lg:w-full max-w-md">
        {/* Phone images with fade transition */}
        <div className="relative h-[500px] sm:h-[600px]">
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide}
              alt={`Mizani Clinic App Screen ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out ${
                currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* Floating badge */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-tanzania-green rounded-full flex items-center justify-center animate-pulse shadow-xl">
          <Phone className="w-10 h-10 text-white" />
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-tanzania-green w-8"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroPhoneSlider;
