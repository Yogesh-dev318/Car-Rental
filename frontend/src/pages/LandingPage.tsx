import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { DotPattern } from '../components/magicui/dot-pattern'; // Adjust path if needed
import { cn } from '../lib/utils';
import { Github, Linkedin } from 'lucide-react';

const LandingPage = () => {
  return (
    // Main container to center content and fill the screen
    <div className="relative h-screen w-full -m-4 -mt-20 flex flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
      
      {/* The Dot Pattern Background */}
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]",
        )}
      />

      {/* Centered Content */}
      <div className="z-10 flex flex-col items-center text-center">
        <h1 className="text-6xl md:text-8xl font-bold">
          Rent-A-Car
        </h1>
        
        <p className="mt-4 max-w-xl text-base md:text-lg text-muted-foreground">
          Find Your Perfect Ride. Discover an unparalleled selection of vehicles for any adventure. Premium cars, unbeatable prices, and seamless booking.
        </p>

        <Button asChild size="lg" className="mt-8 text-lg">
          <Link to="/cars">Explore Cars &rarr;</Link>
        </Button>
      </div>

      {/* Footer at the bottom */}
      <footer className="absolute bottom-0 w-full py-4 text-center text-foreground">
        <div className="flex justify-center items-center space-x-4">
          <span>Yogesh Choudhary</span>
          <div className="h-5 w-px bg-slate-400" /> {/* Separator */}
          <a href="https://github.com/Yogesh-dev318" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            <Github />
          </a>
          <a href="https://www.linkedin.com/in/yogesh-choudhary-87125a24a/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            <Linkedin />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;