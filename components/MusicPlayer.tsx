interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
}

interface MusicPlayerProps {
  playlist: Track[];
  currentTrack: number;
  isPlaying: boolean;
  showPlaylistPanel: boolean;
  onPlayPause: () => void;
  onNextTrack: () => void;
  onPreviousTrack: () => void;
  onTogglePlaylist: () => void;
  onSelectTrack: (index: number) => void;
}

export default function MusicPlayer({
  playlist,
  currentTrack,
  isPlaying,
  showPlaylistPanel,
  onPlayPause,
  onNextTrack,
  onPreviousTrack,
  onTogglePlaylist,
  onSelectTrack
}: MusicPlayerProps) {
  const currentSong = playlist[currentTrack];

  return (
    <div className="relative">
      {/* Compact Music Player */}
      <div className="bg-gradient-to-r from-card to-muted rounded-xl p-4 shadow-sm border border-border bounce-in hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          {/* Track Info */}
          <div 
            className="flex-1 cursor-pointer min-w-0 mr-4"
            onClick={onTogglePlaylist}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center float flex-shrink-0">
                <span className="text-lg">🎵</span>
              </div>
              <div className="flex-1 min-w-0 max-w-[180px]">
                <div className="relative overflow-hidden w-full">
                  <p className={`text-sm font-medium text-foreground whitespace-nowrap ${
                    currentSong.title.length > 20 ? 'scroll-text' : ''
                  }`}>
                    {isPlaying ? `♪ ${currentSong.title}` : currentSong.title}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {currentSong.artist}
                </p>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <button
              onClick={onPreviousTrack}
              className="p-2 text-muted-foreground hover:text-gold transition-colors hover:scale-110 focus-ring-luxury flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            
            <button
              onClick={onPlayPause}
              className={`p-2 rounded-full transition-all duration-300 focus-ring-luxury hover:scale-110 flex-shrink-0 ${
                isPlaying 
                  ? 'bg-gold text-background pulse-glow' 
                  : 'bg-muted text-foreground hover:bg-gold hover:text-background'
              }`}
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
            
            <button
              onClick={onNextTrack}
              className="p-2 text-muted-foreground hover:text-gold transition-colors hover:scale-110 focus-ring-luxury flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Playlist Panel Overlay */}
      {showPlaylistPanel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onTogglePlaylist}>
          <div className="absolute bottom-20 left-4 right-4 bg-card rounded-xl border border-border shadow-xl p-4 max-h-80 overflow-y-auto scale-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Now Playing</h3>
              <button
                onClick={onTogglePlaylist}
                className="p-1 text-muted-foreground hover:text-gold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-2">
              {playlist.map((track, index) => (
                <div
                  key={track.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    index === currentTrack
                      ? 'bg-gold/20 border border-gold/30'
                      : 'bg-secondary/20 hover:bg-secondary/40'
                  }`}
                  onClick={() => onSelectTrack(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
                      {index === currentTrack && isPlaying ? (
                        <span className="text-sm">♪</span>
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{track.title}</p>
                      <p className="text-xs text-muted-foreground">{track.artist}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}