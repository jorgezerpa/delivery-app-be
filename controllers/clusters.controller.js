const db = require('../store/mySql');
const boom = require('@hapi/boom');
const checkIsOver = require('../utils/checkIsOver');

const TABLE = 'clusters';

module.exports = {
    resetClusters: async ()=>{
        const currentHour = new Date().getHours();
        const clusters = [];
        for(let i = 0; i<24; i++){
                //add hour
            let startHour = `${i}`.padStart(2, '0');
            let endHour = `${i+1}`.padStart(2, '0');
            if(endHour==='24') endHour = '00';
            const cluster = { cluster:`${startHour}:00-${endHour}:00`};
                //check is over
            if(checkIsOver(currentHour, i+1)){
                cluster.isOver=1;
            }
            clusters.push(cluster)
        };
        await db.truncate(TABLE);
        for await(let cluster of clusters){
            await db.insert(TABLE, cluster)
        }
        return clusters;
    },
    getCluster : async(id) => {
        const result = await db.get(TABLE, id);
        if(!result) throw boom.notFound('cluster not found')
        return result;
    },
    
    listClusters : async() => {
        const result = await db.list(TABLE);
        return result;
    },
    decreaseResource : async(cluster, data) => {
        const result = await db.update(TABLE, cluster, data);
        if(!result) boom.notFound('cluster not found')
        return result;
    },
    increaseResource : async(cluster, data) => {
        const result = await db.update(TABLE, cluster, data);
        if(!result) boom.notFound('cluster not found')
        return result;
    },
}