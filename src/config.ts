import { ICollectionType, IConfig } from "./lib/app/types";

const CONFIG: IConfig = {
    coinDenom: "uandr",
    name: "Andromeda",
    chainId: "elgafar-1",
    createdDate: "2024-03-31T19:01:01.148Z",
    modifiedDate: "2024-03-31T19:01:01.148Z",
    id: "andromeda",
    collections: [
        {
            auction:
                "andr19sagyxkyenc05rna6g0tw6t2mw7tgusp3w04l3mfz35q6qqwd2ss34cg32",
            cw721: "andr14m4snyfxd0yue5rprhr06udqp5pws6f8rlyk7kxj0nucu5w5cjjqcetldu",
            name: "RedWitch",
            type: ICollectionType.AUCTION,
            id: "auction",
            featured: "ANDR1"
        },
        
    ],
};

export default CONFIG;
