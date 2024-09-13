import type { ModInfo } from "./ModInfo.js"

export interface ScenarioMetaDataKnownRecord {
    isPublished: boolean
    builtin: boolean
    cityName: string
    timeStamp: Date,
    imageRef: string,
    steamPreviewRef: string,
    achievementsDisabled: boolean,
    mods: ModInfo[],
    assets: ModInfo[],
    environment: string,
    population: string
    cash: string
    scenarioName: string
    scenarioDescription: string
    winConditions: Uint8Array
    losingConditions: Uint8Array
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
    invertTraffic: boolean
    assetRef: string
}
