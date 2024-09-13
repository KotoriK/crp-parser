import type { ModInfo } from "./ModInfo.js"

export interface SaveGameMetaDataKnownRecord {
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
    assetRef: string
}
