/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('battlefield');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    isFight: false,
    rallyPoint: { posx: 24, posy: 24 },
    attackerNum : 5 , 
    battleDo:function() {
        // console.log('battle!');
        if(!this.isFight){
            return false;
        }

        attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
        if(attackers.length < this.attackerNum){
            
        }
    }

};