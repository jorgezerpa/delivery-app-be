// const TABLE = 'clusters';

async function resetClusters (){
    const clusters = [];
    for(let i = 0; i<24; i++){
        let startHour = `${i}`.padStart(2, '0');
        let endHour = `${i+1}`.padStart(2, '0');
        if(endHour==='24') endHour = '00';
        const cluster = { hours:`${startHour}:00-${endHour}:00`};
        clusters.push(cluster)
    };
    console.log(clusters)
}
resetClusters();