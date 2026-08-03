"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export function RandomHoverImage({ images, index }: { images: string[], index: number }) {
  // Use a deterministic initial state for Server-Side Rendering to prevent hydration errors
  const [src, setSrc] = useState<string>(images[index % images.length] || "/construction/cons/img.png");

  useEffect(() => {
    // Once hydrated on the client, pick a completely random image
    if (images.length > 0) {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      setSrc(randomImage);
    }
  }, [images]);

  return (
    <Image 
      src={src} 
      alt="Construction background" 
      fill 
      className="object-cover opacity-60" 
    />
  );
}
