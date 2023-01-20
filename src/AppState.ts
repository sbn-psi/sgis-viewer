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
    top: { x: number, y: number }
    left: { x: number, y: number }
    bottom: { x: number, y: number }
    height: number
    naturalHeight: number
    naturalWidth: number
    constructor(json: any) {
        this.name = json.name
        this.url = json.url
        this.top = json.top
        this.left = json.left
        this.bottom = json.bottom
        this.height = json.height
        this.naturalHeight = json.naturalHeight
        this.naturalWidth = json.naturalWidth
    }
}