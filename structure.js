/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('structure');
 * mod.thing == 'a thing'; // true
 */
var constant = require('constant');
module.exports = {
    structuresDo:function(){
        this.linkDo();
        
        //individual structures
        for(let idx in Game.structures){
            let stru = Game.structures[idx];
            if(stru.structureType == STRUCTURE_TOWER){
                this.towerAttack(stru);
                continue;
            }
            
         
            
        }
    },
    structureRun:function(stru){
        if(stru.structureType == STRUCTURE_TOWER){
            this.towerAttack(stru);
        }

    },
    linkDo:function(){
        const sourceLink = Game.getObjectById(constant.SOURCE_LINK);
        const targetLink = Game.getObjectById(constant.TARGET_LINK);
        
        if (sourceLink && targetLink 
                && targetLink.store.getUsedCapacity(RESOURCE_ENERGY) < targetLink.store.getFreeCapacity(RESOURCE_ENERGY)
                && sourceLink.store.getUsedCapacity(RESOURCE_ENERGY) > sourceLink.store.getFreeCapacity(RESOURCE_ENERGY)) {
            sourceLink.transferEnergy(targetLink);
        }

    },
    towerAttack:function(tower){
        
        let hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room `);
            // var towers = Game.rooms[roomName].find(
            //     FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            // towers.forEach(tower => tower.attack(hostiles[0]));
            tower.attack(hostiles[0]);
        }
    }
};