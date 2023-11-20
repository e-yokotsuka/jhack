import { EQUIPPED_TEXT_COLOR } from '../define'
import UI_Window from "./UI_Window";

class UI_MagicWindow extends UI_Window {
    constructor({ core, scene, x = 0, y = 0 }) {
        super({
            core,
            scene,
            x, y,
            maxlabels: 10,
        });
        this.inputMap = {
            'ArrowLeft': _ => this.closeMenu(),
            'w': _ => {
                this.up()
                this.selected();
            },
            's': _ => {
                this.down()
                this.selected();
            },
            'ArrowRight': _ => _ => { },
            'ArrowUp': _ => {
                this.up()
                this.selected();
            },
            'ArrowDown': _ => {
                this.down()
                this.selected();
            },
        };
    }

    closeMenu = _ => this.isOpen && this.scene.uiWindowManager.closeMagicMenu()

    open() {
        const player = this.scene.getPlayer();
        const magics = player.magics();
        const menu = magics.length ? magics.map((magic) => {
            return {
                label: magic.magicName,
                color: super.DEFAULT_TEXT_COLOR,
                action: _ => {
                    this.scene.uiWindowManager.openMagicStatusWindow(this, () => {
                        const logic = new magic.magicLogicClass(this.core, this.scene, magic);
                        const used = logic.use(player);
                        if (used) this.scene.player.magicUsed(magic);
                        this.closeMenu();
                    }, magic);
                }
            }
        }) : [{
            label: "まだ、なにも覚えていない。勉強不足だ！",
            action: _ => {
                const { core: { uiWindowManager } } = this;
                uiWindowManager.closeMagicMenu();
            }
        }];
        this.setMenu(menu);
        super.open();
        if (magics.length) this.selected();
    }

}

export default UI_MagicWindow;