// POČETAK FAJLA: IntelProtocols.jsx
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
        // Pametni API poziv - direktno gađa tvoju Upload plejlistu (menjamo UC u UU)
        // Ovo troši samo 1 API poen, sprečava pucanje sajta i vuče sve automatski
        const uploadsPlaylistId = "UU6ilBUks_oFMSD8CE9qD6lQ"; 
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=8&key=${YOUTUBE_API_KEY}`;
        
        const response = await fetch(url);
        const ytData = await response.json();
        
        if (ytData.items && ytData.items.length > 0) {
          const praviVidei = ytData.items.map(item => {
            const vidId = item.snippet.resourceId.videoId;
            return {
              id: vidId,
              title: item.snippet.title,
              url: `https://www.youtube.com/watch?v=${vidId}`,
              thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url
            };
          });
          setLiveVideos(praviVidei);
        } else { 
          throw new Error("Prazan YouTube odgovor"); 
        }
      } catch (error) {
        console.error("Greška pri povlačenju videa:", error);
      } finally { 
        setIsLoadingVideos(false); 
      }
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
            {[...Array(8)].map((_, i) => <div className="animate-pulse bg-[#0a0a0a] rounded-[2.4rem] p-6 h-48" key={i} />)}
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
// KRAJ FAJLA: IntelProtocols.jsx