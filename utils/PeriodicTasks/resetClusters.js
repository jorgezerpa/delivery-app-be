const clustersController = require('../../controllers/clusters.controller')

async function resetClusters(currentDate, endHour){
    const currentMinute = currentDate.getMinutes();
    const currentHour = currentDate.getHours();
    const isNewDay = (currentHour == endHour && currentMinute == 0); //cause 12:00 am == 00:00, Can not use current > end
    if(isNewDay){
        const result = await clustersController.resetClusters();
        return result;
    }
}

module.exports = resetClusters;