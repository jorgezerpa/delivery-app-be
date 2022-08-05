const clustersController = require('../../controllers/clusters.controller')

async function updateClustersIsOver(){
        const result = await clustersController.updateClustersIsOver();
        return result;
}

module.exports = updateClustersIsOver;