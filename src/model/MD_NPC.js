import MD_Actor from "./MD_Actor";
import MS_Gender from "../data/MS_Gender";
import MS_Race from "../data/MS_Race";

class MD_NPC extends MD_Actor {
    constructor(status) {
        super({
            lv: 1,
            characterName: '',
            hp: 10,
            mp: 10,
            speed: 0.5,
            maxHp: 10,
            maxMp: 10,
            expReward: 0,
            gender: MS_Gender.male.value,
            race: MS_Race.human,
            steps: 0,
            items: [],
            ...status
        });
    }
}

export default MD_NPC;
