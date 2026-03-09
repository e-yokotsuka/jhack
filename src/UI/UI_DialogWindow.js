import { Container, Graphics, Text } from 'pixi.js';

const W = 440;
const H = 155;

class UI_DialogWindow {
    constructor({ core, scene }) {
        this.core = core;
        this.scene = scene;
        this.isOpen = false;
        this.npc = null;
        this.dialogueIndex = 0;

        const prim = new Container();
        prim.visible = false;
        this.prim = prim;

        const panel = new Graphics();
        panel.lineStyle(2, 0xFFFFFF, 1);
        panel.beginFill(0x1a1a4a, 0.92);
        panel.drawRoundedRect(0, 0, W, H, 8);
        panel.endFill();

        this.nameText = new Text('', { fontSize: 16, fill: 0xFFFF88, fontWeight: 'bold' });
        this.nameText.x = 12;
        this.nameText.y = 10;

        const divider = new Graphics();
        divider.lineStyle(1, 0x6666cc, 1);
        divider.moveTo(12, 34);
        divider.lineTo(W - 12, 34);

        this.dialogueText = new Text('', {
            fontSize: 14,
            fill: 0xFFFFFF,
            wordWrap: true,
            wordWrapWidth: W - 24,
        });
        this.dialogueText.x = 12;
        this.dialogueText.y = 42;

        this.hintText = new Text('[Space / Enter: 次へ    Escape: 閉じる]', { fontSize: 11, fill: 0x888888 });
        this.hintText.x = 12;
        this.hintText.y = H - 22;

        panel.addChild(this.nameText);
        panel.addChild(divider);
        panel.addChild(this.dialogueText);
        panel.addChild(this.hintText);
        prim.addChild(panel);
    }

    open(npc) {
        this.npc = npc;
        this.dialogueIndex = 0;
        this.prim.visible = true;
        this.isOpen = true;
        this.scene.windowOpen(true);
        this.nameText.text = npc.characterName;
        this._showCurrent();
    }

    close() {
        this.prim.visible = false;
        this.isOpen = false;
        this.npc = null;
        this.scene.windowOpen(false);
    }

    _showCurrent() {
        const { npc, dialogueIndex } = this;
        if (!npc) return;
        const dialogues = npc.dialogues || [];
        if (dialogueIndex >= dialogues.length) {
            this.close();
            return;
        }
        this.dialogueText.text = dialogues[dialogueIndex];
    }

    resize(width, height) {
        this.prim.x = Math.floor((width - W) / 2);
        this.prim.y = Math.floor(height / 2 - H / 2);
    }

    getPrim = _ => this.prim;

    update() {
        if (!this.isOpen) return;
        const { input } = this.core;
        if (input.isSingleDown(' ') || input.isSingleDown('Enter')) {
            this.dialogueIndex++;
            this._showCurrent();
        } else if (input.isSingleDown('Escape')) {
            this.close();
        }
    }
}

export default UI_DialogWindow;
