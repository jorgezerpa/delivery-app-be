const resetClusters = require('./resetClusters');

function startMonitoring(){
    setInterval(async()=>{
        const currentDate = new Date();
        await resetClusters(currentDate, 0);
    }, 60000)
}
// 60000

module.exports = { startMonitoring };
