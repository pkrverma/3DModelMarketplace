import { ICollectionType, IConfig } from "./lib/app/types";

const CONFIG: IConfig = {
    coinDenom: "uandr",
    name: "3D model Marketplace",
    chainId: "galileo-4",
    createdDate: "2025-01-03T09:14:41.148Z",
    modifiedDate: "2025-01-03T09:14:41.148Z",
    id: "andromeda",
    collections: [
        {
            marketplace: "andr1w095srs2335mdzy8maextd8hvela6dkzsy7cldfen8ctf8tnhfwq7v9jaw",
            cw721: "andr13w656m4tzax4q2k69v6p0uhkp0psxvr8n03f9yc0svvsv97kf39svanpsg",
            name: "3d Collection",
            type: ICollectionType.MARKETPLACE,
            id: "marketplace",
        }
    ],
};

export default CONFIG;
