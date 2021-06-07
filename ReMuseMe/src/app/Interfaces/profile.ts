export interface Profile {

    country: string,
    display_name: string,
    email: string,
    explict_content: {
        filter_enabled: boolean,
        filter_locked: boolean,
    }
    external_urls: {
        spotify: string,
    }
    followers: {
        href: null,
        total: number
    }
    href: string,
    id: string,
    images: [{
        width: null,
        url: string,
        height: null
    }]
    product: string,
    type: string,
    uri: string
}
