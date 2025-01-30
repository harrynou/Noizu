type Providers = 'spotify' | 'soundcloud'

interface SearchItem {
    id: string;
    name: string;
    imageUrl: string | null;  
}

interface Track extends SearchItem {
    albumType: string | null,
    duration: number,
}





export const normalizeSearchData = async (provider:Providers, searchData: any): Promise<SearchItem[]> => {
    if (provider === 'spotify'){
        const metadata = searchData.tracks;
        const tracks = metadata.items;
        return tracks.map((track:any) => ({
            id: track.id,
            name: track.name,
            imageUrl: track.album.images[0].url,
            albumType: track.album.album_type,
            duration: track.duration_ms
        })
    )} else { // provider is soundcloud
        const tracks = searchData;
        return tracks.map((track:any) => ({
            id: tracks.id,
            name: track.title,
            imageUrl: track.artwork_url,
            albumType: null,
            duration: track.duration
        }))
    }
}