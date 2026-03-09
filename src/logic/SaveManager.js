import MS_Item from "../data/MS_Item";
import MS_Magic from "../data/MS_Magics";

const SAVE_KEY = "jhack_save_v1";

const SaveManager = {
    hasSave() {
        return !!localStorage.getItem(SAVE_KEY);
    },

    save({ playerStatus, floor }) {
        const p = playerStatus;
        const data = {
            version: 1,
            floor,
            player: {
                characterName: p.characterName,
                lv: p.lv,
                exp: p.exp,
                nextExp: p.nextExp,
                hp: p.hp,
                maxHp: p.maxHp,
                mp: p.mp,
                maxMp: p.maxMp,
                str: p.str,
                dex: p.dex,
                con: p.con,
                intl: p.intl,
                wiz: p.wiz,
                cha: p.cha,
                modifiers: { ...p.modifiers },
                mapX: p.mapX,
                mapY: p.mapY,
                items: p.items.map(item => item.id),
                equipments: {
                    weapon: p.equipments.weapon?.id ?? "empty",
                    armour: p.equipments.armour?.id ?? "empty",
                    shield: p.equipments.shield?.id ?? "empty",
                    ring:   p.equipments.ring?.id   ?? "empty",
                },
                magics: {
                    white: p.magics.white.map(m => m.id),
                    black: p.magics.black.map(m => m.id),
                },
                steps: p.steps,
            }
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    },

    load() {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return null;
        try {
            const data = JSON.parse(raw);
            const p = data.player;
            // アイテム復元
            p.items = p.items
                .map(id => MS_Item.find(item => item.id === id))
                .filter(Boolean);
            // 装備復元
            const findItem = id => MS_Item.find(item => item.id === id) ?? MS_Item[0];
            p.equipments = {
                weapon: findItem(p.equipments.weapon),
                armour: findItem(p.equipments.armour),
                shield: findItem(p.equipments.shield),
                ring:   findItem(p.equipments.ring),
            };
            // 魔法復元
            const findMagic = id => MS_Magic.find(m => m.id === id);
            p.magics = {
                white: p.magics.white.map(findMagic).filter(Boolean),
                black: p.magics.black.map(findMagic).filter(Boolean),
            };
            return data;
        } catch (e) {
            console.error("[SaveManager] load failed:", e);
            return null;
        }
    },

    deleteSave() {
        localStorage.removeItem(SAVE_KEY);
    },
};

export default SaveManager;
