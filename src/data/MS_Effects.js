import EL_Common from "../logic/effects/EL_Common"
import EL_Sleep from "../logic/effects/EL_Sleep"

export default [
    {
        id: "sleep",
        name: "睡眠",
        description: "眠っている",
        value: '2d20+20',//最大60ターン寝る
        texture: 'petrify',
        effectLogicClass: EL_Sleep
    },
    {
        id: "paralysis",
        name: "マヒ",
        description: "身体が動かない",
        value: "",
        texture: 'petrify',
        effectLogicClass: EL_Common
    },
    {
        id: "poison",
        name: "毒",
        description: "徐々にHPが減少",
        value: "",
        texture: 'poison',
        effectLogicClass: EL_Common
    },
    {
        id: "burn",
        name: "火傷",
        description: "炎によるダメージ",
        value: "",
        texture: 'fire_drake',
        effectLogicClass: EL_Common
    },
    {
        id: "freeze",
        name: "凍結",
        description: "動きが遅くなる",
        value: "",
        texture: 'freeze',
        effectLogicClass: EL_Common
    },
    {
        id: "blind",
        name: "盲目",
        description: "命中率が下がる",
        value: "",
        texture: 'blink',
        effectLogicClass: EL_Common
    },
    {
        id: "silence",
        name: "沈黙",
        description: "魔法が使えない",
        value: "",
        texture: 'silenced',
        effectLogicClass: EL_Common
    },
    {
        id: "confuse",
        name: "混乱",
        description: "行動がランダムになる",
        value: "",
        texture: 'confuse',
        effectLogicClass: EL_Common
    },
    {
        id: "charm",
        name: "魅了",
        description: "敵を攻撃できなくなる",
        value: "",
        texture: 'error', // ダミー
        effectLogicClass: EL_Common
    },
    {
        id: "fear",
        name: "恐怖",
        description: "逃走の確率が上がる",
        value: "",
        texture: 'error', // ダミー
        effectLogicClass: EL_Common
    },
    {
        id: "curse",
        name: "呪い",
        description: "特定の能力が下がる",
        value: "",
        texture: 'error', // ダミー
        effectLogicClass: EL_Common
    },
    {
        id: "stone",
        name: "石化",
        description: "完全に動けなくなる",
        value: "",
        texture: 'error', // ダミー
        effectLogicClass: EL_Common
    },
    {
        id: "weakness",
        name: "弱体",
        description: "全ての能力が下がる",
        value: "",
        texture: 'error', // ダミー
        effectLogicClass: EL_Common
    },
    {
        id: "berserk",
        name: "狂暴",
        description: "攻撃力が上がるが防御力が下がる",
        value: "",
        texture: 'error', // ダミー
        effectLogicClass: EL_Common
    },
]