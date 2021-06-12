export interface Tracks{
    album: {
        album_type:string,
        artists: [
            {
               external_urls: {
                   spotify: string;
               }
               id: string,
               name: string,
               type: string,
               uri: string
            },  
        ]
        id: string,
        images: [{
                height: number,
                url: string,
                width: number
            }],

        name: string,
        release_date: string,
        release_date_precision: string,
        type: string,
        uri: string,
        
    },
    name: string,
    uri: string,
    preview_url: string,
    external_urls:{
        spotify: string,
    },
    id: string
}