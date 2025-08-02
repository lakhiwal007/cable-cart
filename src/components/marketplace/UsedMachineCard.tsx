import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MapPin, Play } from 'lucide-react';
import { WhatsAppContact } from '@/components/ui/whatsapp-contact';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/apiClient';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface UsedMachineCardProps {
  item: any;
  onMediaClick: (url: string, type: 'image' | 'video') => void;
}

const UsedMachineCard: React.FC<UsedMachineCardProps> = ({ item, onMediaClick }) => {
  const navigate = useNavigate();
  
  // Early return if no item
  if (!item) {
    console.error('UsedMachineCard: No item provided');
    return (
      <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
        <p className="text-red-600 text-sm">Error: No machine data provided</p>
      </div>
    );
  }

  // Main media (prioritize image, fallback to video, then placeholder)
  const mainImage = item.image_urls?.[0];
  const mainVideo = item.video_urls?.[0];
  const hasMainImage = !!mainImage;
  const mainMediaUrl = mainImage || mainVideo || '/placeholder.svg';
  const mainMediaType = mainImage ? 'image' : (mainVideo ? 'video' : 'image');
  
  const imageThumbnails = item.image_urls?.slice(hasMainImage ? 1 : 0, 4) || [];
  const videoThumbnails = item.video_urls?.slice(hasMainImage ? 0 : 1, 3) || [];
  // Combine image and video thumbnails, limit to 3 total
  const allThumbnails = [...imageThumbnails, ...videoThumbnails].slice(0, 3);
  const isAuthenticated = apiClient.isAuthenticated();

  try {
    return (
      <div className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 h-full bg-white rounded-lg overflow-hidden shadow-sm">
        {/* Product Media Section with Carousel */}
        <div className="relative overflow-hidden rounded-t-lg bg-gray-100 h-40 sm:h-32 lg:h-48">
          {allThumbnails.length > 0 ? (
            <Carousel className="w-full h-full" opts={{ loop: true }}>
              <CarouselContent>
                {/* Main media first */}
                <CarouselItem>
                  {mainMediaType === 'video' && mainVideo ? (
                    <div className="relative w-full h-full">
                      <video
                        src={mainMediaUrl}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => onMediaClick(mainMediaUrl, 'video')}
                        onError={(e) => {
                          const img = document.createElement('img');
                          img.src = '/placeholder.svg';
                          img.className = 'w-full h-full object-cover cursor-pointer';
                          img.alt = item.machine_name || 'Used Machine';
                          e.currentTarget.parentNode?.replaceChild(img, e.currentTarget);
                        }}
                        muted
                        preload="metadata"
                      />
                      {/* Video play icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                        <div className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                          <Play className="h-5 w-5 text-gray-800 ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={mainMediaUrl}
                      alt={item.machine_name || 'Used Machine'}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => onMediaClick(mainMediaUrl, mainMediaType)}
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  )}
                </CarouselItem>
                
                {/* Additional media */}
                {allThumbnails.map((url: string, i: number) => {
                  const isVideo = videoThumbnails.includes(url);
                  return (
                    <CarouselItem key={`thumb-${i}`}>
                      {isVideo ? (
                        <div className="relative w-full h-full">
                          <video
                            src={url}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => onMediaClick(url, 'video')}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                            muted
                            preload="metadata"
                          />
                          {/* Video play icon overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                            <div className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                              <Play className="h-5 w-5 text-gray-800 ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={url}
                          alt={`${item.machine_name} - ${i + 1}`}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => onMediaClick(url, 'image')}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              
              {/* Navigation arrows - only show if more than 1 media item */}
              {(allThumbnails.length > 0) && (
                <>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 opacity-70 hover:opacity-100" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 opacity-70 hover:opacity-100" />
                </>
              )}
              
              {/* Media counter */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {allThumbnails.length + 1} media
              </div>
            </Carousel>
          ) : (
            /* Fallback for no additional media */
            <div className="relative w-full h-full">
              {mainMediaType === 'video' && mainVideo ? (
                <div className="relative w-full h-full">
                  <video
                    src={mainMediaUrl}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => onMediaClick(mainMediaUrl, 'video')}
                    onError={(e) => {
                      const img = document.createElement('img');
                      img.src = '/placeholder.svg';
                      img.className = 'w-full h-full object-cover cursor-pointer';
                      img.alt = item.machine_name || 'Used Machine';
                      e.currentTarget.parentNode?.replaceChild(img, e.currentTarget);
                    }}
                    muted
                    preload="metadata"
                  />
                  {/* Video play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                    <div className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                      <Play className="h-5 w-5 text-gray-800 ml-0.5" />
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={mainMediaUrl}
                  alt={item.machine_name || 'Used Machine'}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => onMediaClick(mainMediaUrl, mainMediaType)}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              )}
            </div>
          )}
          
          {/* Badges Overlay */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex items-center justify-between gap-1 sm:gap-2 z-10">
            {item.electrical_panel_ok !== undefined && (
              <Badge className={`shadow-lg text-xs px-2 py-1 ${item.electrical_panel_ok ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                {item.electrical_panel_ok ? 'Panel OK' : 'Panel Issues'}
              </Badge>
            )}
          </div>
          
          {/* Quick Actions Overlay */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <Button size="sm" variant="secondary" className="rounded-full shadow-lg h-8 w-8 sm:h-9 sm:w-9" onClick={() => onMediaClick(mainMediaUrl, mainMediaType)}>
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
        {/* Product Info Section */}
        <div className="p-3 sm:p-4">
          {/* Product Title */}
          <h2 className="text-sm sm:text-md lg:text-lg font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => onMediaClick(mainMediaUrl, mainMediaType)}>
            {item.machine_name || 'Used Machine'}
          </h2>
          {/* Price */}
          {item.price && (
            <div className="text-base lg:text-2xl font-bold text-green-700 mb-1">₹{item.price.toLocaleString()}</div>
          )}
          {/* Location & Year */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 text-xs sm:text-sm text-gray-600 gap-1 sm:gap-0">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">{item.location || 'Not specified'}</span>
            </div>
            {item.year_of_make && (
              <div className="flex items-center gap-1">
                <span className="truncate">{item.year_of_make}</span>
              </div>
            )}
          </div>
          {/* Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm mb-4">
            <div><span className="font-medium">Size:</span> {item.size || 'N/A'}</div>
            <div><span className="font-medium">Motor HP:</span> {item.main_motor_hp || 'N/A'}</div>
            <div><span className="font-medium">Last Working Year:</span> {item.last_working_year || 'N/A'}</div>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/used-machine/${item.id}`)}
              className="w-full h-10 sm:h-9 text-sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            {item.whatsapp_number ? (
              isAuthenticated ? (
                <WhatsAppContact
                  phoneNumber={item.whatsapp_number}
                  listingTitle={item.machine_name || 'Used Machine'}
                  listingType="supply"
                  listingId={item.id}
                  variant="default"
                  size="default"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors h-10 sm:h-9 text-sm"
                  defaultMessage={`Hello, I'm interested in your used machine: ${item.machine_name}. Please provide more details.`}
                >
                  Contact
                </WhatsAppContact>
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full h-10 sm:h-9 text-sm bg-blue-600 hover:bg-blue-700"
                >
                  Login to Contact
                </Button>
              )
            ) : (
              <Button
                className="w-full h-10 sm:h-9 text-sm bg-gray-400 cursor-not-allowed"
                disabled
              >
                No Contact
              </Button>
            )}
          </div>
          {/* Posted Date */}
          <div className="mt-2 sm:mt-3 text-xs text-gray-500 text-center">
            Posted {new Date(item.created_at || Date.now()).toLocaleDateString()}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering UsedMachineCard:', error);
    return (
      <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
        <p className="text-red-600 text-sm">Error rendering machine card</p>
        <p className="text-xs text-gray-500 mt-1">{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
};

export default UsedMachineCard; 