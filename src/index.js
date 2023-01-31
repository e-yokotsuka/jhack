import './app.css';

import Core from './logic/Core';

const init = async _ => {
    const core = new Core({ isShowStats: true });
    if (await core.Load())
        await core.Start();
};
init();