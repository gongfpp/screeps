/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('constant');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    STORE_PRIORITY: [
        STRUCTURE_SPAWN,         // 孵化器具有最高优先级
        STRUCTURE_EXTENSION,     // 然后是扩展
        STRUCTURE_TOWER,         // 防御塔次之
        STRUCTURE_STORAGE,       // 存储设施之后
        STRUCTURE_CONTAINER,     // 容器排在存储设施之后
        STRUCTURE_TERMINAL,      // 终端通常用于市场交易，优先级较低
        STRUCTURE_LINK           // 链接最后，通常用于远程传输能量
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
    SUPPORTER_MAX_NUM: 2,
    UPGRADER_MAX_NUM: 0,
    REPAIRER_MAX_NUM: 1,
    BUILDER_MAX_NUM: 1,
    XIANGZI_MAX_NUM: 1,
    //RANGE :
    STORE_RANGE_MAX: 6,
    WORKER_PATH_LONGEST: 5,
    SUPPORTER_REPAIR_RANGE: 2,
    //ROOM:
    TARGET_ROOM_ID: 'W2N33',
    SPAWN_HOME: 'Spawn1',
    //SOUCE:
    SOURCE_ID_1: '5bbcb0409099fc012e63bcd1',
    SOURCE_ID_2: '5bbcb0409099fc012e63bcd0',
    //LOOP:
    SHORT_PERIROD_TICKS: 10,
    MID_PERIROD_TICKS: 20,
    LONG_PERIROD_TICKS: 1500,
    //LINK
    SOURCE_LINK: '65d6221f8ef10e17e67a93ca',
    TARGET_LINK: '65d8d006ecef434ff888cb0f',
    TARGET_LINK_2: '65dc9beb4311aa2fc2699429',
    //STORAGE
    STORAGE_ID: '65d5ad955e8efe73adf434b1',

    SAFE_MODE_COUNT: 2,


    IsUnderAttack: 0,
    IS_HOME_PEACE:true
};