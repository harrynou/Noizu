

// 
export const grabTrackIds = (tracks: any[], provider?: string) => {
    if (provider){
        return tracks.filter((track) => track.provider === provider ? track.track_id : null).map((track) => track.track_id);;
    } else {
        return tracks.map((track) => track.track_id);
    }

} 