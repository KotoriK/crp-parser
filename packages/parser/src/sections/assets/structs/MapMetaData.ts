import type { ModInfo } from "./ModInfo.js"

export interface MapMetaDataKnownRecord {
    builtIn: boolean
    environment: string
    mapName: string
    timeStamp: Date
    imageRef: string
    steamPreviewRef: string
    publishedHash: number
    buildableArea: number
    maxResourceAmount: number
    oilAmount: number
    oreAmount: number
    forestAmount: number
    fertileLandAmount: number
    waterAmount: number
    incomingRoads: number
    outgoingRoads: number
    incomingTrainTracks: number
    outgoingTrainTracks: number
    incomingShipPath: number
    outgoingShipPath: number
    incomingPlanePath: number
    outgoingPlanePath: number
    mods: ModInfo[]
    assetRef: string
}