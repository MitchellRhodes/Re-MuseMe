export interface Recommendations {
    tracks: [
        {
            artists: [ {
                external_urls: {
                    spotify: string,
                },
                href: string,
                id: string,
                name: string,
                type: string,
                uri: string
            }], 
            href: string,
            id: string,
            is_playable: boolean,
            name: string,
            preview_url: string,
            track_number: number, 
            type: string,
            uri: string
        }
    ], 
    seeds: [
        {
            initialPoolSize: number, 
            afterFilteringSize: number, 
            afterRelinkingSize: number,
            href: string,
            id: string,
            type: string
        }
    ]
}