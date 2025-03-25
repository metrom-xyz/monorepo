export interface Contract {
    address: string;
    startBlock: number;
}

interface NamedContract extends Contract {
    name: string;
}

interface LegacyPoolContract extends NamedContract {
    lpToken: string;
    basePoolAddress?: string;
}

export interface ChainConfig {
    grafting?: {
        base: string;
        block: number;
    };
    nativeToken: {
        address: string;
        symbol: string;
        name: string;
        decimals: number;
    };
    contracts: {
        LegacyPools: LegacyPoolContract[];
        Registries: NamedContract[];
        MetapoolFactory: Contract;
        TwoCryptoFactory: Contract;
        StableSwapCrvUsdFactory: Contract;
        TriCryptoNGFactory: Contract;
        StableSwapNGFactory: Contract;
        TwoCryptoNGFactory: Contract;
        GaugeController: Contract;
    };
}

export const DEPLOYMENTS: Record<string, ChainConfig> = {
    mainnet: {
        // grafting: {
        //     base: "QmRmT8oUMJ3CabcaNib2fU5fjbcUPAn8D262W9SqmPJpJE",
        //     block: 19050050,
        // },
        nativeToken: {
            address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            symbol: "ETH",
            name: "Ether",
            decimals: 18,
        },
        contracts: {
            LegacyPools: [
                {
                    name: "crv3crypto",
                    address: "0xD51a44d3FaE010294C616388b506AcdA1bfAAE46",
                    lpToken: "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff",
                    startBlock: 12821148,
                },
                {
                    name: "crvEURTUSD",
                    address: "0x9838eCcC42659FA8AA7daF2aD134b53984c9427b",
                    lpToken: "0x3b6831c0077a1e44ED0a21841C3bC4dC11bCE833",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 13526617,
                },
                {
                    name: "crvEURSUSDC",
                    address: "0x98a7F18d4E56Cfe84E3D081B40001B3d5bD3eB8B",
                    lpToken: "0x3D229E1B4faab62F621eF2F6A610961f7BD7b23B",
                    startBlock: 13530680,
                },
                {
                    name: "EUROC3CRV",
                    address: "0xE84f5b1582BA325fDf9cE6B0c1F087ccfC924e54",
                    lpToken: "0x70fc957eb90E37Af82ACDbd12675699797745F68",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 15045848,
                },
                {
                    name: "crvCVXETH",
                    address: "0xB576491F1E6e5E62f1d8F26062Ee822B40B0E0d4",
                    lpToken: "0x3A283D9c08E8b55966afb64C515f5143cf907611",
                    startBlock: 13783426,
                },
                {
                    name: "crvXAUTUSD",
                    address: "0xAdCFcf9894335dC340f6Cd182aFA45999F45Fc44",
                    lpToken: "0x8484673cA7BfF40F82B041916881aeA15ee84834",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 13854276,
                },
                {
                    name: "crvSPELLETH",
                    address: "0x98638FAcf9a3865cd033F36548713183f6996122",
                    lpToken: "0x8282BD15dcA2EA2bDf24163E8f2781B30C43A2ef",
                    startBlock: 13931746,
                },
                {
                    name: "crvTETH",
                    address: "0x752eBeb79963cf0732E9c0fec72a49FD1DEfAEAC",
                    lpToken: "0xCb08717451aaE9EF950a2524E33B6DCaBA60147B",
                    startBlock: 13931849,
                },
                {
                    name: "3Crv",
                    address: "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    lpToken: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
                    startBlock: 10809473,
                },
                {
                    name: "a3CRV",
                    address: "0xDeBF20617708857ebe4F679508E7b7863a8A8EeE",
                    lpToken: "0xFd2a8fA60Abd58Efe3EeE34dd494cD491dC14900",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 11497106,
                },
                {
                    name: "ankrCRV",
                    address: "0xA96A65c051bF88B4095Ee1f2451C2A9d43F53Ae2",
                    lpToken: "0xaA17A236F2bAdc98DDc0Cf999AbB47D47Fc0A6Cf",
                    startBlock: 11774139,
                },
                {
                    name: "yDAI+yUSDC+yUSDT+yBUSD",
                    address: "0x79a8C46DeA5aDa233ABaFFD40F3A0A2B1e5A4F27",
                    lpToken: "0x3B3Ac5386837Dc563660FB6a0937DFAa5924333B",
                    startBlock: 9567295,
                },
                {
                    name: "cDAI+cUSDC",
                    lpToken: "0x845838DF265Dcd2c412A1Dc9e959c7d08537f8a2",
                    address: "0xA2B47E3D5c44877cca798226B7B8118F9BFb7A56",
                    startBlock: 9554040,
                },
                {
                    name: "eursCRV",
                    lpToken: "0x194eBd173F6cDacE046C53eACcE9B953F28411d1",
                    address: "0x0Ce6a5fF5217e38315f87032CF90686C96627CAA",
                    startBlock: 11466871,
                },
                {
                    name: "hCRV",
                    lpToken: "0xb19059ebb43466C323583928285a49f558E572Fd",
                    address: "0x4CA9b3063Ec5866A4B82E437059D2C43d1be596F",
                    startBlock: 10732328,
                },
                {
                    name: "ib3CRV",
                    lpToken: "0x5282a4eF67D9C33135340fB3289cc1711c13638C",
                    address: "0x2dded6Da1BF5DBdF597C45fcFaa3194e53EcfeAF",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 11831119,
                },
                {
                    name: "linkCRV",
                    lpToken: "0xcee60cFa923170e4f8204AE08B4fA6A3F5656F3a",
                    address: "0xF178C0b5Bb7e7aBF4e12A4838C7b7c5bA2C623c0",
                    startBlock: 11875215,
                },
                {
                    name: "ypaxCrv",
                    lpToken: "0xD905e2eaeBe188fc92179b6350807D8bd91Db0D8",
                    address: "0x06364f10B501e868329afBc005b3492902d6C763",
                    startBlock: 10041041,
                },
                {
                    name: "crvRenWBTC",
                    lpToken: "0x49849C98ae39Fff122806C06791Fa73784FB3675",
                    address: "0x93054188d876f558f4a66B2EF1d97d16eDf0895B",
                    startBlock: 10151385,
                },
                {
                    name: "saCRV",
                    lpToken: "0x02d341CcB60fAaf662bC0554d13778015d1b285C",
                    address: "0xEB16Ae0052ed37f479f7fe63849198Df1765a733",
                    startBlock: 11772500,
                },
                {
                    name: "crvRenWSBTC",
                    lpToken: "0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3",
                    address: "0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714",
                    startBlock: 10276641,
                },
                {
                    name: "eCRV",
                    lpToken: "0xA3D87FffcE63B53E0d54fAa1cc983B7eB0b74A9c",
                    address: "0xc5424B857f758E906013F3555Dad202e4bdB4567",
                    startBlock: 11491884,
                },
                {
                    name: "steCRV",
                    lpToken: "0x06325440D014e39736583c165C2963BA99fAf14E",
                    address: "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022",
                    startBlock: 11592551,
                },
                {
                    name: "crvPlain3andSUSD",
                    lpToken: "0xC25a3A3b969415c80451098fa907EC722572917F",
                    address: "0xA5407eAE9Ba41422680e2e00537571bcC53efBfD",
                    startBlock: 9906598,
                },
                {
                    name: "cDAI+cUSDC+USDT",
                    lpToken: "0x9fC689CCaDa600B6DF723D9E47D84d76664a1F23",
                    address: "0x52EA46506B9CC5Ef470C5bf89f17Dc28bB35D85C",
                    startBlock: 9456293,
                },
                {
                    name: "yDAI+yUSDC+yUSDT+yTUSD",
                    lpToken: "0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8",
                    address: "0x45F783CCE6B7FF23B2ab2D70e416cdb7D6055f51",
                    startBlock: 9476468,
                },
                {
                    name: "dusd3CRV",
                    lpToken: "0x3a664Ab939FD8482048609f652f9a0B0677337B9",
                    address: "0x8038C01A0390a8c547446a0b2c18fc9aEFEcc10c",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 11187276,
                },
                {
                    name: "gusd3CRV",
                    lpToken: "0xD2967f45c4f384DEEa880F807Be904762a3DeA07",
                    address: "0x4f062658EaAF2C1ccf8C8e36D6824CDf41167956",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 11005604,
                },
                {
                    name: "husd3CRV",
                    lpToken: "0x5B5CFE992AdAC0C9D48E05854B2d91C73a003858",
                    address: "0x3eF6A01A0f81D6046290f3e2A8c5b843e738E604",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 11010070,
                },
                {
                    name: "LinkUSD3CRV",
                    lpToken: "0x6D65b498cb23deAba52db31c93Da9BFFb340FB8F",
                    address: "0xE7a24EF0C5e95Ffb0f6684b813A78F2a3AD7D171",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 11011556,
                },
                {
                    name: "musd3CRV",
                    lpToken: "0x1AEf73d49Dedc4b1778d0706583995958Dc862e6",
                    address: "0x8474DdbE98F5aA3179B3B3F5942D724aFcdec9f6",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 11011940,
                },
                {
                    name: "rsv3CRV",
                    lpToken: "0xC2Ee6b0334C261ED60C72f6054450b61B8f18E35",
                    address: "0xC18cC39da8b11dA8c3541C598eE022258F9744da",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 11037531,
                },
                {
                    name: "usdk3CRV",
                    lpToken: "0x97E2768e8E73511cA874545DC5Ff8067eB19B787",
                    address: "0x3E01dD8a5E1fb3481F0F589056b428Fc308AF0Fb",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 11010305,
                },
                {
                    name: "usdn3CRV",
                    lpToken: "0x4f3E8F405CF5aFC05D68142F3783bDfE13811522",
                    address: "0x0f9cb53Ebe405d49A0bbdBD291A65Ff571bC83e1",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 11010514,
                },
                {
                    name: "usdp3CRV",
                    lpToken: "0x7Eb40E450b9655f4B3cC4259BCC731c63ff55ae6",
                    address: "0x42d7025938bEc20B69cBae5A77421082407f053A",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 11922057,
                },
                {
                    name: "ust3CRV",
                    lpToken: "0x94e131324b6054c0D789b190b2dAC504e4361b53",
                    address: "0x890f4e345B1dAED0367A877a1612f86A1f86985f",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 11466568,
                },
                {
                    name: "bBTC/sbtcCRV",
                    lpToken: "0x410e3E86ef427e30B9235497143881f717d93c2A",
                    address: "0x071c661B4DeefB59E2a3DdB20Db036821eeE8F4b",
                    basePoolAddress:
                        "0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714",
                    startBlock: 11455022,
                },
                {
                    name: "oBTC/sbtcCRV",
                    lpToken: "0x2fE94ea3d5d4a175184081439753DE15AeF9d614",
                    address: "0xd81dA8D904b52208541Bade1bD6595D8a251F8dd",
                    basePoolAddress:
                        "0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714",
                    startBlock: 11459238,
                },
                {
                    name: "pBTC/sbtcCRV",
                    lpToken: "0xDE5331AC4B3630f94853Ff322B66407e0D6331E8",
                    address: "0x7F55DDe206dbAD629C080068923b36fe9D6bDBeF",
                    basePoolAddress:
                        "0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714",
                    startBlock: 11421596,
                },
                {
                    name: "tbtc/sbtcCrv",
                    lpToken: "0x64eda51d3Ad40D56b9dFc5554E06F94e1Dd786Fd",
                    address: "0xC25099792E9349C7DD09759744ea681C7de2cb66",
                    basePoolAddress:
                        "0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714",
                    startBlock: 11095928,
                },
                {
                    name: "TUSD3CRV-f",
                    lpToken: "0xEcd5e75AFb02eFa118AF914515D6521aaBd189F1",
                    address: "0xEcd5e75AFb02eFa118AF914515D6521aaBd189F1",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 12010370,
                },
                {
                    name: "LUSD3CRV-f",
                    lpToken: "0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA",
                    address: "0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 12242627,
                },
                {
                    name: "FRAX3CRV-f",
                    lpToken: "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B",
                    address: "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 11972002,
                },
                {
                    name: "BUSD3CRV-f",
                    lpToken: "0x4807862AA8b2bF68830e4C8dc86D0e9A998e085a",
                    address: "0x4807862AA8b2bF68830e4C8dc86D0e9A998e085a",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 12240440,
                },
                {
                    name: "rCRV",
                    lpToken: "0x53a901d48795C58f485cBB38df08FA96a24669D5",
                    address: "0xF9440930043eb3997fc70e1339dBb11F341de7A8",
                    startBlock: 12463576,
                },
                {
                    name: "alUSD3CRV-f",
                    lpToken: "0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c",
                    address: "0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 11956693,
                },
                {
                    name: "crvTricrypto",
                    lpToken: "0xcA3d75aC011BF5aD07a98d02f18225F9bD9A6BDF",
                    address: "0x80466c64868E1ab14a1Ddf27A676C3fcBE638Fe5",
                    startBlock: 12521538,
                },
                {
                    name: "RAI3CRV",
                    lpToken: "0x6BA5b4e438FA0aAf7C1bD179285aF65d13bD3D90",
                    address: "0x618788357D0EBd8A37e763ADab3bc575D54c2C7d",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 13634171,
                },
                {
                    name: "MIM-3LP3CRV-f",
                    lpToken: "0x5a6A4D54456819380173272A5E8E9B9904BdF41B",
                    address: "0x5a6A4D54456819380173272A5E8E9B9904BdF41B",
                    basePoolAddress:
                        "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
                    startBlock: 12567592,
                },
                {
                    name: "EURT-f",
                    lpToken: "0xFD5dB7463a3aB53fD211b4af195c5BCCC1A03890",
                    address: "0xFD5dB7463a3aB53fD211b4af195c5BCCC1A03890",
                    startBlock: 12921922,
                },
                {
                    name: "4CRV",
                    lpToken: "0x4e0915C88bC70750D68C481540F081fEFaF22273",
                    address: "0x4e0915C88bC70750D68C481540F081fEFaF22273",
                    startBlock: 14631356,
                },
                {
                    name: "2CRV",
                    lpToken: "0x1005F7406f32a61BD760CfA14aCCd2737913d546",
                    address: "0x1005F7406f32a61BD760CfA14aCCd2737913d546",
                    startBlock: 14631073,
                },
                {
                    name: "crvFRAX",
                    lpToken: "0x3175Df0976dFA876431C2E9eE6Bc45b65d3473CC",
                    address: "0xDcEF968d416a41Cdac0ED8702fAC8128A64241A2",
                    startBlock: 14939588,
                },
                {
                    name: "frxETHCRV",
                    lpToken: "0xf43211935C781D5ca1a41d2041F397B8A7366C7A",
                    address: "0xa1F8A6807c402E4A15ef4EBa36528A3FED24E577",
                    startBlock: 15741010,
                },
                {
                    name: "crvWSBTC",
                    lpToken: "0x051d7e5609917Bd9b73f04BAc0DED8Dd46a74301",
                    address: "0xf253f83AcA21aAbD2A20553AE0BF7F65C755A07F",
                    startBlock: 16099802,
                },
                {
                    name: "crvfraxUSDP",
                    lpToken: "0xFC2838a17D8e8B1D5456E0a351B0708a09211147",
                    address: "0xaE34574AC03A15cd58A92DC79De7B1A0800F1CE3",
                    startBlock: 16831677,
                },
                {
                    name: "ETHwBETHCRV",
                    lpToken: "0xBfAb6FA95E0091ed66058ad493189D2cB29385E6",
                    address: "0xBfAb6FA95E0091ed66058ad493189D2cB29385E6",
                    startBlock: 17138959,
                },
            ],
            Registries: [
                {
                    name: "PoolRegistry",
                    address: "0x90E00ACe148ca3b23Ac1bC8C240C2a7Dd9c2d7f5",
                    startBlock: 12195750,
                },
                {
                    name: "CryptoSwapRegistry",
                    address: "0x9a32aF1A11D9c937aEa61A3790C2983257eA8Bc0",
                    startBlock: 15731970,
                },
            ],
            MetapoolFactory: {
                address: "0xB9fC157394Af804a3578134A6585C0dc9cc990d4",
                startBlock: 12903979,
            },
            TwoCryptoFactory: {
                address: "0xF18056Bbd320E96A48e3Fbf8bC061322531aac99",
                startBlock: 14005321,
            },
            StableSwapCrvUsdFactory: {
                address: "0x4F8846Ae9380B90d2E71D5e3D042dff3E7ebb40d",
                startBlock: 17257971,
            },
            TriCryptoNGFactory: {
                address: "0x0c0e5f2fF0ff18a3be9b835635039256dC4B4963",
                startBlock: 17371439,
            },
            StableSwapNGFactory: {
                address: "0x6A8cbed756804B16E05E741eDaBd5cB544AE21bf",
                startBlock: 18427841,
            },
            TwoCryptoNGFactory: {
                address: "0x98ee851a00abee0d95d08cf4ca2bdce32aeaaf7f",
                startBlock: 18867338,
            },
            GaugeController: {
                address: "0x2f50d538606fa9edd2b11e2446beb18c9d5846bb",
                startBlock: 10647875,
            },
        },
    },
};
