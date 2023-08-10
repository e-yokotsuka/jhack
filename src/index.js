import './app.css';

import Core from './logic/Core';

const init = async _ => {
    const core = new Core({ isShowStats: true });
    await core.reset();
};
init();