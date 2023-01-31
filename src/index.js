import './app.css';

import Core from './logic/core';

const setup = async _ => {
    const core = new Core({ isShowStats: true });
    await core.Start();
}

const init = async _ => {
    await setup();
};
init();