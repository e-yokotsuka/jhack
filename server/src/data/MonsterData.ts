// サーバー側モンスターデータ（クライアントの MS_Monster から主要データを抽出）
export interface MonsterDef {
    lv: number;
    spawnStartLv: number;
    spawnEndLv: number;
    skin: string;
    characterName: string;
    maxHp: number;
    expReward: number;
    currentBehavior: string;
    speed: number;
}

const MONSTER_DEFS: MonsterDef[] = [
    { lv: 1, spawnStartLv: 0, spawnEndLv: 2, skin: 'goblin', characterName: 'ゴブリン', maxHp: 15, expReward: 100, currentBehavior: 'aggressive', speed: 0.3 },
    { lv: 2, spawnStartLv: 0, spawnEndLv: 3, skin: 'brown_ooze', characterName: 'ブラウンウーズ', maxHp: 30, expReward: 60, currentBehavior: 'very_aggressive', speed: 0.3 },
    { lv: 2, spawnStartLv: 1, spawnEndLv: 4, skin: 'hobgoblin', characterName: 'ホブゴブリン', maxHp: 25, expReward: 200, currentBehavior: 'aggressive', speed: 0.4 },
    { lv: 2, spawnStartLv: 1, spawnEndLv: 4, skin: 'kobold', characterName: 'コボルド', maxHp: 20, expReward: 200, currentBehavior: 'aggressive', speed: 0.5 },
    { lv: 3, spawnStartLv: 0, spawnEndLv: 4, skin: 'boggart', characterName: 'ボガート', maxHp: 40, expReward: 100, currentBehavior: 'aggressive', speed: 0.6 },
    { lv: 3, spawnStartLv: 1, spawnEndLv: 5, skin: 'deformed_human', characterName: 'デフォームドヒューマン', maxHp: 30, expReward: 300, currentBehavior: 'aggressive', speed: 0.3 },
    { lv: 3, spawnStartLv: 2, spawnEndLv: 5, skin: 'human', characterName: 'ヒューマン', maxHp: 40, expReward: 300, currentBehavior: 'aggressive', speed: 0.6 },
    { lv: 4, spawnStartLv: 2, spawnEndLv: 5, skin: 'azure_jelly', characterName: 'アズールゼリー', maxHp: 50, expReward: 120, currentBehavior: 'aggressive', speed: 0.5 },
    { lv: 4, spawnStartLv: 2, spawnEndLv: 6, skin: 'dwarf', characterName: 'ドワーフ', maxHp: 40, expReward: 400, currentBehavior: 'aggressive', speed: 0.4 },
    { lv: 4, spawnStartLv: 2, spawnEndLv: 6, skin: 'elf', characterName: 'エルフ', maxHp: 40, expReward: 400, currentBehavior: 'aggressive', speed: 0.4 },
    { lv: 5, spawnStartLv: 3, spawnEndLv: 7, skin: 'ogre', characterName: 'オーガ', maxHp: 80, expReward: 500, currentBehavior: 'aggressive', speed: 0.5 },
    { lv: 6, spawnStartLv: 4, spawnEndLv: 8, skin: 'deep_troll', characterName: 'ディープトロール', maxHp: 100, expReward: 600, currentBehavior: 'aggressive', speed: 0.6 },
    { lv: 7, spawnStartLv: 5, spawnEndLv: 9, skin: 'necromancer', characterName: 'ネクロマンサー', maxHp: 110, expReward: 700, currentBehavior: 'aggressive', speed: 0.6 },
    { lv: 8, spawnStartLv: 6, spawnEndLv: 9, skin: 'ettin', characterName: 'エッティン', maxHp: 120, expReward: 800, currentBehavior: 'aggressive', speed: 0.8 },
    { lv: 9, spawnStartLv: 7, spawnEndLv: 9, skin: 'dragon', characterName: 'ドラゴン', maxHp: 150, expReward: 900, currentBehavior: 'aggressive', speed: 0.9 },
    { lv: 10, spawnStartLv: 5, spawnEndLv: 9, skin: 'angel', characterName: 'エンジェル', maxHp: 200, expReward: 500, currentBehavior: 'aggressive', speed: 1.2 },
];

export const getMonsterDefsForFloor = (floor: number): MonsterDef[] =>
    MONSTER_DEFS.filter(m => floor >= m.spawnStartLv && floor <= m.spawnEndLv);

export default MONSTER_DEFS;
