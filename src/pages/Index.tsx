import { useState, lazy, Suspense, memo } from "react";
import Header from "@/components/mobi/Header";
import Hero from "@/components/mobi/Hero";
import Footer from "@/components/mobi/Footer";
import WhatsAppButton from "@/components/mobi/WhatsAppButton";
import LoadingScreen from "@/components/mobi/LoadingScreen";
import FloatingElements from "@/components/mobi/FloatingElements";
import CustomCursor from "@/components/mobi/CustomCursor";
import ChatBot from "@/components/mobi/ChatBot";

const Clients = lazy(() => import("@/components/mobi/Clients"));
const About = lazy(() => import("@/components/mobi/About"));
const Services = lazy(() => import("@/components/mobi/Services"));
const Process = lazy(() => import("@/components/mobi/Process"));
const Technologies = lazy(() => import("@/components/mobi/Technologies"));
const Projects = lazy(() => import("@/components/mobi/Projects"));
const Timeline = lazy(() => import("@/components/mobi/Timeline"));
const FAQ = lazy(() => import("@/components/mobi/FAQ"));
const Contact = lazy(() => import("@/components/mobi/Contact"));
const ScrollProgress = lazy(() => import("@/components/mobi/ScrollProgress"));
const Team = lazy(() => import("@/components/mobi/Team"));
const Testimonials = lazy(() => import("@/components/mobi/Testimonials"));

const Blog = lazy(() => import("@/components/mobi/Blog"));

const SectionLoader = memo(() => (
  <div className="w-full py-20 flex justify-center">
    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
));

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden dark">
      <FloatingElements />
      <CustomCursor />
      
      <Suspense fallback={null}>
        <ScrollProgress />
      </Suspense>

      <Header />

      <main className="relative z-10">
        <Hero />
        <Suspense fallback={<SectionLoader />}><Clients /></Suspense>
        <Suspense fallback={<SectionLoader />}><About /></Suspense>
        <Suspense fallback={<SectionLoader />}><Services /></Suspense>
        <Suspense fallback={<SectionLoader />}><Process /></Suspense>
        <Suspense fallback={<SectionLoader />}><Technologies /></Suspense>
        <Suspense fallback={<SectionLoader />}><Timeline /></Suspense>
        <Suspense fallback={<SectionLoader />}><Projects /></Suspense>
        
        <Suspense fallback={<SectionLoader />}><Team /></Suspense>
        <Suspense fallback={<SectionLoader />}><Testimonials /></Suspense>
        <Suspense fallback={<SectionLoader />}><FAQ /></Suspense>
        <Suspense fallback={<SectionLoader />}><Blog /></Suspense>
        <Suspense fallback={<SectionLoader />}><Contact /></Suspense>
      </main>

      <Footer />
      <WhatsAppButton />
      <ChatBot />
    </div>
  );
};

export default Index;
