const resetClusters = require('./resetClusters');
const updateClustersIsOver = require('./updateClusterIsOver ');

function startMonitoring(){
    setInterval(async()=>{
        try {
            const currentDate = new Date();
            await resetClusters(currentDate, 0);
            await updateClustersIsOver();
        } catch (error) {
            console.log(error)
        }
    }, 60000)
}
// 60000

module.exports = { startMonitoring };
