export class AppState {
    readonly overview: Zone
    readonly zones: Zone[]
    readonly selectedZone: Zone | null = null
    readonly selectedPOI: any
    readonly zoomLevel: number = 1
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

export class POI {
    name: string
    x: number
    y: number
    data: any
    constructor(json: any) {
        this.name = json.name
        this.x = json.x
        this.y = json.y
        this.data = json.data
    }
}