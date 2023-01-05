export class AppState {
    readonly overview: Zone
    readonly zones: Zone[]
    readonly selectedZone: Zone | null = null
    constructor({ overview, zones }: { overview: Zone, zones: Zone[] }) {
        this.overview = overview
        this.zones = zones
    }
}

export class Zone {
    name: string
    url: string
    top?: { x: number, y: number }
    left?: { x: number, y: number }
    bottom?: { x: number, y: number }
    height?: number
    naturalHeight?: number
    naturalWidth?: number
    constructor(name: string, url: string) {
        this.name = name
        this.url = url
    }
    static fromJson(json: any): Zone {
        let zone = new Zone(json.name, json.url)
        zone.top = json.top
        zone.left = json.left
        zone.bottom = json.bottom
        zone.naturalHeight = json.naturalHeight
        zone.naturalWidth = json.naturalWidth
        return zone
    }
}