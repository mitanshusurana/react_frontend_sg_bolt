import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Download, Play, Pause } from 'lucide-react';

interface GemstoneGalleryProps {
  images: string[];
  video?: string;
  name: string;
}

const GemstoneGallery: React.FC<GemstoneGalleryProps> = ({ images, video, name }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // Combine images and video for the gallery
  const mediaItems = [...images];
  if (video) {
    mediaItems.push(video);
  }
  
  const isCurrentItemVideo = video && currentIndex === mediaItems.length - 1;
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
  };
  
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1));
  };
  
  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };
  
  const toggleFullScreen = () => {
    setShowFullScreen(!showFullScreen);
  };
  
  const toggleVideoPlay = () => {
    setIsVideoPlaying(!isVideoPlaying);
    
    const videoElement = document.getElementById('gemstone-video') as HTMLVideoElement;
    if (videoElement) {
      if (isVideoPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
    }
  };
  
  return (
    <div className="gallery-container">
      {/* Main image or video */}
      <div 
        className="relative aspect-square md:aspect-[4/3] lg:aspect-[16/9] bg-neutral-100 overflow-hidden rounded-lg"
        onClick={toggleFullScreen}
      >
        {isCurrentItemVideo ? (
          <div className="w-full h-full flex items-center justify-center">
            <video
              id="gemstone-video"
              src={video}
              controls={false}
              className="max-h-full max-w-full object-contain"
              poster={images.length > 0 ? images[0] : undefined}
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleVideoPlay();
              }}
              className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full text-white"
            >
              {isVideoPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8" />
              )}
            </button>
          </div>
        ) : (
          <img
            src={mediaItems[currentIndex]}
            alt={`${name} - image ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />
        )}
        
        {/* Navigation arrows */}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-800 rounded-full p-1"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-800 rounded-full p-1"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
        
        {/* Download button */}
        {!isCurrentItemVideo && (
          <a
            href={mediaItems[currentIndex]}
            download={`${name.replace(/\s+/g, '-').toLowerCase()}-${currentIndex + 1}.jpg`}
            className="absolute bottom-2 right-2 bg-white/80 hover:bg-white text-neutral-800 rounded-full p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="h-4 w-4" />
          </a>
        )}
      </div>
      
      {/* Thumbnails */}
      {mediaItems.length > 1 && (
        <div className="gallery-thumbnails">
          {mediaItems.map((item, index) => (
            <div 
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative ${
                currentIndex === index ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              {index === mediaItems.length - 1 && video ? (
                <div className="w-16 h-16 rounded-md bg-neutral-200 flex items-center justify-center relative">
                  <Play className="h-6 w-6 text-neutral-500" />
                  <span className="absolute bottom-0 right-0 bg-primary-600 text-white text-xs px-1 rounded-tl-md">
                    Video
                  </span>
                </div>
              ) : (
                <img
                  src={item}
                  alt={`${name} thumbnail ${index + 1}`}
                  className="gallery-thumbnail"
                />
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Fullscreen modal */}
      {showFullScreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 sm:p-8">
          <button
            onClick={toggleFullScreen}
            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="w-full max-w-6xl max-h-[90vh]">
            {isCurrentItemVideo ? (
              <div className="relative aspect-video">
                <video
                  src={video}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <img
                src={mediaItems[currentIndex]}
                alt={`${name} - fullscreen`}
                className="max-h-[80vh] max-w-full mx-auto object-contain"
              />
            )}
            
            {/* Navigation arrows for fullscreen */}
            {mediaItems.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GemstoneGallery;