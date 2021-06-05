export interface Artists {
    genres: string[], 
    id: string,
    name: string, 
    images: [{
        height: number,
        url: string,
        width: number
    }],
    followers: {
        total: number
    },
    external_urls: {
        spotify: string
    }
}
