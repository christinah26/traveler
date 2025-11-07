import React, { useState, useEffect, useRef } from "react";

function FadeInSection({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setIsVisible(entry.isIntersecting));
    });

    const element = domRef.current;

    if (element){
    observer.observe(element);}

    return () =>{ if(element) observer.unobserve(element)};
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-opacity duration-700 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
}

export default FadeInSection;
