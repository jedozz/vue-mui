//2021.05.08
import mui from '@assets/lib/mui.js'
window.mui = mui
var plusReady = mui.plusReady;
mui.plusReady = function (callback) {
    if (typeof callback == 'function') {
        plusReady(() => {
            callback();
        });
    } else {
        return new Promise((reslove => {
            plusReady(() => {
                reslove(window.plus);
            });
        }))
    }
}
export default mui