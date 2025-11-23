import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Apple } from "lucide-react";
import { useState } from "react";

export const HeroSection = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <section className="w-full bg-hero-bg py-16 md:py-24">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-hero-bg p-8 md:p-12 lg:p-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-6">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-balance leading-tight">
                Helping people find the truth in a noisy world
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                CruxAI verifies facts, detects misinformation, and gives you clarity when it matters the most.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-8 py-6 text-lg font-semibold shadow-md hover:shadow-lg transition-all">
                      Login or Sign Up
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-display text-2xl">Create your account</DialogTitle>
                      <DialogDescription>
                        Join CruxAI to start verifying facts and combating misinformation.
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullname">Full Name</Label>
                        <Input id="fullname" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                      </div>
                      <Button type="submit" className="w-full bg-primary hover:bg-primary-hover" size="lg">
                        Create Account
                      </Button>
                    </form>
                    
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <Button variant="outline" className="w-full">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Facebook className="w-5 h-5" />
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Apple className="w-5 h-5" />
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {/* Right Column - Images */}
            <div className="hidden md:flex gap-4 items-center justify-end">
              <div className="h-[350px] w-[200px] rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=700&fit=crop" 
                  alt="Fact checking illustration" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-[350px] w-[200px] rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=700&fit=crop" 
                  alt="News verification" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-[350px] w-[200px] rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=700&fit=crop" 
                  alt="Trust and transparency" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
