export interface Tracks{
    album: {
        album_type:string,
        artists: [
            {
               external_urls: string;
               id: string,
               name: string,
               type: string,
               uri: string
            },  
        ]
        id: string,
        images: [
            {
                height: number,
                url: string,
                width: number
            }
        ],
        name: string,
        release_date: string,
        release_date_precision: string,
        type: string,
        uri: string,
    }
}