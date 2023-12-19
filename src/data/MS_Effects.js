import EL_Common from "../logic/effects/EL_Common"
import EL_Sleep from "../logic/effects/EL_Sleep"

export default [
    {
        id: "sleep",
        name: "睡眠",
        description: "眠っている",
        value: '1d8+3',//最大12ターン寝る
        effectLogicClass: EL_Sleep
    },
    {
        id: "paralysis",
        name: "マヒ",
        description: "身体が動かない",
        value: "",
        effectLogicClass: EL_Common
    },
    {
        id: "poison",
        name: "毒",
        description: "徐々にHPが減少",
        value: "",
        effectLogicClass: EL_Common
    },
    {
        id: "burn",
        name: "火傷",
        description: "炎によるダメージ",
        value: "",
        effectLogicClass: EL_Common
    },
    {
        id: "freeze",
        name: "凍結",
        description: "動きが遅くなる",
        value: "",
        effectLogicClass: EL_Common
    },
    {
        id: "blind",
        name: "盲目",
        description: "命中率が下がる",
        value: "",
        effectLogicClass: EL_Common
    },
    {
        id: "silence",
        name: "沈黙",
        description: "魔法が使えない",
        value: "",
        effectLogicClass: EL_Common
    },
    {
        id: "confuse",
        name: "混乱",
        description: "行動がランダムになる",
        value: "",
        effectLogicClass: EL_Common
    },
    {
        id: "charm",
        name: "魅了",
        description: "敵を攻撃できなくなる",
        value: "",
        effectLogicClass: EL_Common
    },
    {
        id: "fear",
        name: "恐怖",
        description: "逃走の確率が上がる",
        value: "",
        effectLogicClass: EL_Common
    },
    {
        id: "curse",
        name: "呪い",
        description: "特定の能力が下がる",
        value: "",
        effectLogicClass: EL_Common
    },
    {
        id: "stone",
        name: "石化",
        description: "完全に動けなくなる",
        value: "",
        effectLogicClass: EL_Common
    },
    {
        id: "weakness",
        name: "弱体",
        description: "全ての能力が下がる",
        value: "",
        effectLogicClass: EL_Common
    },
    {
        id: "berserk",
        name: "狂暴",
        description: "攻撃力が上がるが防御力が下がる",
        value: "",
        effectLogicClass: EL_Common
    },
]