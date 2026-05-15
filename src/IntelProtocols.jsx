import React, { useState, useEffect } from 'react';
import { Youtube } from 'lucide-react';
import V8Reveal from './V8Reveal';
import { TutorialCard } from './data';

const YOUTUBE_API_KEY = "AIzaSyCwy46TsBPW7LxKTjExhQbHhYhq8lyc2YM"; 

const IntelProtocols = () => {
  const [liveVideos, setLiveVideos] = useState([]); 
  const [isLoadingVideos, setIsLoadingVideos] = useState(true); 

  useEffect(() => {
    const fetchYouTubeVideos = async () => {
      try {
        const channelId = "UC6ilBUks_oFMSD8CE9qD6lQ"; 
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=8&order=date&type=video&key=${YOUTUBE_API_KEY}`;
        const response = await fetch(url);
        const ytData = await response.json();
        
        if (ytData.items && ytData.items.length > 0) {
          const praviVidei = ytData.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url
          }));
          setLiveVideos(praviVidei);
        } else { throw new Error("Empty YouTube Response"); }
      } catch (error) {
        // Fallback videi ako YouTube API prekorači kvotu
        setLiveVideos([
          { id: "v8-1", title: "V8 Premium Education 1", url: "https://www.youtube.com/watch?v=M7lc1UVf-VE", thumbnail: "https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg" },
          { id: "v8-2", title: "V8 Intel Protocol 2", url: "https://www.youtube.com/watch?v=M7lc1UVf-VE", thumbnail: "https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg" },
          { id: "v8-3", title: "V8 Trade Secrets 3", url: "https://www.youtube.com/watch?v=M7lc1UVf-VE", thumbnail: "https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg" },
          { id: "v8-4", title: "V8 Masterclass 4", url: "https://www.youtube.com/watch?v=M7lc1UVf-VE", thumbnail: "https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg" }
        ]);
      } finally { setIsLoadingVideos(false); }
    };
    fetchYouTubeVideos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-left">
      <V8Reveal delay={0.1} direction="left">
        <div id="protocols" className="flex items-center gap-4 mb-10">
          <div className="flex items-center gap-2.5 shrink-0">
            <Youtube className="text-red-600 w-6 h-6" />
            <h3 className="text-white font-black uppercase text-[20px] tracking-widest italic">LATEST INTEL PROTOCOLS</h3>
          </div>
          <div className="h-[1px] w-32 bg-gradient-to-r from-red-600/80 to-transparent"></div>
        </div>
      </V8Reveal>
      
      <V8Reveal delay={0.3} direction="up">
        {isLoadingVideos ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {[...Array(4)].map((_, i) => <div className="animate-pulse bg-[#0a0a0a] rounded-[2.4rem] p-6 h-48" key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {liveVideos.map((vid, i) => <TutorialCard key={i} vid={vid} />)}
          </div>
        )}
      </V8Reveal>
    </div>
  );
};

export default IntelProtocols;