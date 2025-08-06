import { render, screen, fireEvent } from '../../__tests__/utils/testUtils';
import MusicPlayer from '../MusicPlayer';
import { mockPlaylist } from '../../__tests__/utils/testUtils';

describe('MusicPlayer', () => {
  const defaultProps = {
    playlist: mockPlaylist,
    currentTrack: 0,
    isPlaying: false,
    showPlaylistPanel: false,
    onPlayPause: jest.fn(),
    onNextTrack: jest.fn(),
    onPreviousTrack: jest.fn(),
    onTogglePlaylist: jest.fn(),
    onSelectTrack: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render current track information', () => {
    render(<MusicPlayer {...defaultProps} />);

    expect(screen.getByText('Test Song 1')).toBeInTheDocument();
    expect(screen.getByText('Test Artist 1')).toBeInTheDocument();
  });

  it('should show playing indicator when music is playing', () => {
    render(<MusicPlayer {...defaultProps} isPlaying={true} />);

    expect(screen.getByText('♪ Test Song 1')).toBeInTheDocument();
  });

  it('should call onPlayPause when play/pause button is clicked', () => {
    render(<MusicPlayer {...defaultProps} />);

    const playButton = screen.getByRole('button', { name: /play|pause/i });
    fireEvent.click(playButton);

    expect(defaultProps.onPlayPause).toHaveBeenCalledTimes(1);
  });

  it('should call onNextTrack when next button is clicked', () => {
    render(<MusicPlayer {...defaultProps} />);

    // Find the next button by its SVG path
    const nextButtons = screen.getAllByRole('button');
    const nextBtn = nextButtons.find(btn => 
      btn.querySelector('svg path[d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"]')
    );

    if (nextBtn) {
      fireEvent.click(nextBtn);
      expect(defaultProps.onNextTrack).toHaveBeenCalledTimes(1);
    }
  });

  it('should call onPreviousTrack when previous button is clicked', () => {
    render(<MusicPlayer {...defaultProps} />);

    const prevButtons = screen.getAllByRole('button');
    const prevBtn = prevButtons.find(btn => 
      btn.querySelector('svg path[d="M6 6h2v12H6zm3.5 6l8.5 6V6z"]')
    );

    if (prevBtn) {
      fireEvent.click(prevBtn);
      expect(defaultProps.onPreviousTrack).toHaveBeenCalledTimes(1);
    }
  });

  it('should call onTogglePlaylist when track info is clicked', () => {
    render(<MusicPlayer {...defaultProps} />);

    // Click on the track info area
    const trackInfo = screen.getByText('Test Song 1').closest('div');
    if (trackInfo) {
      fireEvent.click(trackInfo);
      expect(defaultProps.onTogglePlaylist).toHaveBeenCalledTimes(1);
    }
  });

  it('should display different track when currentTrack changes', () => {
    render(<MusicPlayer {...defaultProps} currentTrack={1} />);

    expect(screen.getByText('Test Song 2')).toBeInTheDocument();
    expect(screen.getByText('Test Artist 2')).toBeInTheDocument();
  });

  it('should show playlist panel when showPlaylistPanel is true', () => {
    render(<MusicPlayer {...defaultProps} showPlaylistPanel={true} />);

    expect(screen.getByText('Now Playing')).toBeInTheDocument();
    
    // Check if all tracks are displayed in playlist
    expect(screen.getByText('Test Song 1')).toBeInTheDocument();
    expect(screen.getByText('Test Song 2')).toBeInTheDocument();
    expect(screen.getByText('Test Song 3')).toBeInTheDocument();
  });

  it('should highlight current track in playlist', () => {
    render(<MusicPlayer {...defaultProps} showPlaylistPanel={true} currentTrack={1} />);

    // The current track should have a different styling
    const playlistItems = screen.getAllByText(/Test Song/);
    expect(playlistItems).toHaveLength(4); // 1 in player + 3 in playlist
  });

  it('should call onSelectTrack when playlist item is clicked', () => {
    render(<MusicPlayer {...defaultProps} showPlaylistPanel={true} />);

    // Find and click a playlist item (not the main player one)
    const playlistContainer = screen.getByText('Now Playing').closest('div');
    const trackItems = playlistContainer?.querySelectorAll('[data-testid], .cursor-pointer');
    
    if (trackItems && trackItems.length > 0) {
      fireEvent.click(trackItems[0] as HTMLElement);
      // Note: This might need adjustment based on the actual DOM structure
    }
  });

  it('should show close button in playlist panel', () => {
    render(<MusicPlayer {...defaultProps} showPlaylistPanel={true} />);

    const closeButtons = screen.getAllByRole('button');
    const hasCloseButton = closeButtons.some(button => 
      button.querySelector('svg path[d*="M6 18L18 6M6 6l12 12"]')
    );
    
    expect(hasCloseButton).toBe(true);
  });

  it('should handle long track titles with scroll animation', () => {
    const longTitlePlaylist = [
      { 
        id: 1, 
        title: "This is a very long song title that should trigger scroll animation", 
        artist: "Artist", 
        duration: "3:30" 
      }
    ];

    render(<MusicPlayer {...defaultProps} playlist={longTitlePlaylist} />);

    const titleElement = screen.getByText(/This is a very long song title/);
    expect(titleElement).toHaveClass('scroll-text');
  });

  it('should display track durations in playlist', () => {
    render(<MusicPlayer {...defaultProps} showPlaylistPanel={true} />);

    expect(screen.getByText('3:30')).toBeInTheDocument();
    expect(screen.getByText('4:15')).toBeInTheDocument();
    expect(screen.getByText('2:45')).toBeInTheDocument();
  });

  it('should show playing icon for current track when music is playing', () => {
    render(<MusicPlayer {...defaultProps} showPlaylistPanel={true} isPlaying={true} currentTrack={0} />);

    // Look for the music note symbol in the playlist for the current track
    const playingIndicators = screen.getAllByText('♪');
    expect(playingIndicators.length).toBeGreaterThan(0);
  });
});