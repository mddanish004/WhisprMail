"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, MessageCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["anonymous", "honest", "private", "secure", "real"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 items-center justify-center flex-col">

          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-regular">
              <span className="text-gray-900">Receive</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-custom-blue"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
              <span className="text-gray-900"> Messages</span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-gray-600 max-w-3xl text-center">
              Create your unique public link and receive honest, anonymous feedback from anyone. 
              Safe, secure, and completely anonymous messaging platform that protects your privacy.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/auth/signup">
              <Button size="lg" className="gap-4 bg-custom-blue hover:bg-custom-blue">
                Start Receiving Messages <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" className="gap-4" variant="outline">
                <MessageCircle className="w-4 h-4" />
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero }; 