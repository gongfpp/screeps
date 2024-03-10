/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('constant');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    ROOM_GROUPS_ID: ['W3N33'],
    STORE_PRIORITY: [
        STRUCTURE_SPAWN,    
        STRUCTURE_EXTENSION,
        STRUCTURE_TOWER,    
        STRUCTURE_STORAGE,  
        STRUCTURE_CONTAINER,
        STRUCTURE_TERMINAL, 
        STRUCTURE_LINK      
    ],
    REPAIR_PRIORITY: {
        [STRUCTURE_TOWER]: 1,
        [STRUCTURE_SPAWN]: 2,
        [STRUCTURE_EXTENSION]: 3,
        [STRUCTURE_CONTAINER]: 4,
        [STRUCTURE_WALL]: 5,
        [STRUCTURE_ROAD]: 6,
        [STRUCTURE_STORAGE]: 7,
    },


    // DEFENDER
    DEFENDER_MAX_NUM: 2,
    //creep num : 
    WORKER_MAX_NUM: null,
    HAVERSTER_MAX_NUM: 2,
    SUPPORTER_MAX_NUM: 1,
    UPGRADER_MAX_NUM: 1,
    REPAIRER_MAX_NUM: 1,
    BUILDER_MAX_NUM: 1,
    XIANGZI_MAX_NUM: 1,
    //RANGE :
    STORE_RANGE_MAX: 6,
    WORKER_PATH_LONGEST: 5,
    SUPPORTER_REPAIR_RANGE: 2,
    //ROOM:
    TARGET_ROOM_ID: 'W2N33',
    HOME_ROOM_ID: 'W2N33',
    SPAWN_HOME: 'Spawn1',
    //SOUCE:
    SOURCE_ID_1: '',
    SOURCE_ID_2: '',
    //LOOP:
    SHORT_PERIROD_TICKS: 10,
    MID_PERIROD_TICKS: 20,
    LONG_PERIROD_TICKS: 1500,
    //LINK
    SOURCE_LINK: '',
    TARGET_LINK: '',
    TARGET_LINK_2: '',
    //STORAGE
    STORAGE_ID: '',

    SAFE_MODE_COUNT: 2,


    IsUnderAttack: 0,
    IS_HOME_PEACE:true
};