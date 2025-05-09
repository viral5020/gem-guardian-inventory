
import { useState } from "react";
import Navbar from "@/components/Navbar";
import StoneMatchingTool from "@/components/StoneMatchingTool";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const StoneMatching = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Stone Matching</h1>
          <p className="text-muted-foreground">
            Find matching pairs or sets of diamonds by size and grade for creating custom jewelry pieces.
          </p>
          
          <StoneMatchingTool />
        </div>
      </main>
    </div>
  );
};

export default StoneMatching;
