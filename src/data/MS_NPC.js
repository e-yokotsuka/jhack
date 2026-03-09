import MS_Gender from "./MS_Gender";
import MS_Race from "./MS_Race";

// NPCの性格（disposition）
// WARLIKE: 好戦的 - 積極的に攻撃するが会話も可能
// NEUTRAL: 中立   - 攻撃しない、会話可能
// HOSTILE: 敵対的 - 即座に攻撃、会話不可
export const NPC_DISPOSITION = {
    WARLIKE: 'warlike',
    NEUTRAL: 'neutral',
    HOSTILE: 'hostile',
};

// spawnConfig:
//   type: 'fixed'  → 指定フロアの固定位置（x,y指定）またはランダム位置に配置
//   type: 'random' → 指定フロアのランダム位置に配置
//   floor: 配置するフロア番号 (0始まり)
//   x, y: fixed かつ座標指定の場合のみ使用
export default [
    {
        characterName: '謎の商人',
        skin: 'human',
        disposition: NPC_DISPOSITION.NEUTRAL,
        spawnConfig: { type: 'fixed', floor: 0 },
        dialogues: [
            'やあ、旅人よ。何かお探しかな？',
            '危険なダンジョンだが、お気をつけて。',
            'またいつでも話しかけてくれ！',
        ],
        lv: 5, maxHp: 80, maxMp: 40, speed: 0.5,
        expReward: 0,
        gender: MS_Gender.male.value, race: MS_Race.human,
    },
    {
        characterName: '古老の賢者',
        skin: 'wizard',
        disposition: NPC_DISPOSITION.NEUTRAL,
        spawnConfig: { type: 'fixed', floor: 3, x: 10, y: 10 },
        dialogues: [
            'ふむ、珍しい客じゃ。',
            '深階には強大な魔物が潜むぞ。気をつけよ。',
            '武器と防具を整えることを忘れずにな。',
        ],
        lv: 8, maxHp: 60, maxMp: 100, speed: 0.4,
        expReward: 0,
        gender: MS_Gender.male.value, race: MS_Race.human,
    },
    {
        characterName: '傭兵隊長',
        skin: 'vault_guard',
        disposition: NPC_DISPOSITION.WARLIKE,
        spawnConfig: { type: 'random', floor: 2 },
        dialogues: [
            'おい、お前…俺の縄張りに入るな。',
            '金を払えば見逃してやらんこともないが…。',
        ],
        lv: 6, maxHp: 100, maxMp: 20, speed: 0.7,
        expReward: 300,
        gender: MS_Gender.male.value, race: MS_Race.human,
    },
    {
        characterName: '闇のハンター',
        skin: 'hell_knight',
        disposition: NPC_DISPOSITION.HOSTILE,
        spawnConfig: { type: 'random', floor: 5 },
        dialogues: ['死ねッ！！'],
        lv: 10, maxHp: 150, maxMp: 50, speed: 0.9,
        expReward: 500,
        gender: MS_Gender.male.value, race: MS_Race.human,
    },
];
