import './app.css';

import Core from './logic/Core';
import UI_Lobby from './ui/UI_Lobby';

const init = async _ => {
    const core = new Core({ isShowStats: true });
    await core.reset();

    // ロビー画面を表示
    const { app, uiCommon } = core;
    const lobby = new UI_Lobby({
        core,
        // シングルプレイ：そのまま開始
        onSingle: () => {
            console.log("[Lobby] single play");
        },
        // マルチプレイ：NetworkManager を GameScene に渡す
        onMulti: async (networkManager) => {
            const gameScene = core.getScene('game');
            gameScene.enableMultiplayer(networkManager);
            uiCommon.setConnectionStatus('connected');
            networkManager.room.onLeave(() => uiCommon.setConnectionStatus('error'));
            console.log("[Lobby] multiplayer enabled, host=", networkManager.isHost);
        },
        onConnecting: () => uiCommon.setConnectionStatus('connecting'),
        onConnectFailed: () => uiCommon.setConnectionStatus('error'),
    });
    app.stage.addChild(lobby.getPrim());
    lobby.resize(app.renderer.width, app.renderer.height);
    lobby.show();

    window.addEventListener('resize', () => {
        lobby.resize(app.renderer.width, app.renderer.height);
    });
};

init();
