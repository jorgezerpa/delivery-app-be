const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');

const dbconf = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

let connection;

async function handleCon (){
  connection = mysql.createConnection(dbconf);


  await connection.connect((err) => {
      if (err) {
          console.error('[db err]', err);
          setTimeout(handleCon, 2000);
      } else {
          console.log('DB Connected!');
      }
  });
  connection.on('error', err => {
      console.error('[db err]', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          handleCon();
      } else {
          throw err;
      }
  })

        //db changes listenner
const instance = new MySQLEvents(connection, {
  startAtEnd: true,
  includeSchema: { 'delivery_system':['clusters'] }
});
await instance.start()
  .then(()=>{console.log('listening DB changes')})
instance.addTrigger({
  name:'monitoring db changes',
  expression: 'delivery_system.*',
  statment: MySQLEvents.STATEMENTS.ALL,
  onEvent: e => {
    console.log(e)
  }
})


} //close handleCon function
handleCon();

        
        
        
        //db handlers
function insert(table, data) {
  return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
          if (err) return reject(err);
          resolve(result);
      })
  })
}


function list(table) {
  return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM ${table}`, (err, result) => {
          if (err) return reject(err);
          resolve(result);
      })
  })
}

function filterList(table, data) {
  return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM ${table} WHERE ?`, data ,(err, result) => {
          if (err) return reject(err);
          resolve(result);
      })
  })
}

function get(table, id) {
  return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM ${table} WHERE id=${id}`, (err, result) => {
          if (err) return reject(err);
          resolve(result[0]);
      })
  })
}

function update(table, id, data){
  return new Promise((resolve, reject)=>{
    connection.query(`UPDATE ${table} SET ? WHERE id=${id}`, data, (err, result)=>{
      if (err) return reject(err);
      resolve(result);
    })
  })
}

function getUserByEmail(table, email) {
  return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM ${table} WHERE email="${email}"`, (err, result) => {
          if (err) return reject(err);
          resolve(result[0]);
      })
  })
}


function remove(table, id) {
  return new Promise((resolve, reject) => {
      connection.query(`DELETE FROM ${table} WHERE id=${id}`, (err, result) => {
          if (err) return reject(err);
          if(result.affectedRows<=0) return reject(new Error('not found'))
          resolve(true);
      })
  })
}

function truncate(table){
  return new Promise((resolve, reject) => {
    connection.query(`TRUNCATE ${table}`, (err, result)=>{
      if (err) return reject(err);
      resolve(true);
    })
  })
}


module.exports = {
  insert,
  list,
  filterList,
  get,
  update,
  getUserByEmail,
  remove,
  truncate
};





// on mysql.ini
// we need to add the following lines under [mysqld] section, and then restart mysql.

// log-bin=bin.log
// log-bin-index=bin-log.index
// max_binlog_size=100M
// binlog_format=row
// socket=mysql.sock
















// async function handleCon (){
//   connection = mysql.createConnection(dbconf);

//   connection.connect((err) => {
//       if (err) {
//           console.error('[db err]', err);
//           setTimeout(handleCon, 2000);
//       } else {
//           console.log('DB Connected!');
//       }
//   });
//   connection.on('error', err => {
//       console.error('[db err]', err);
//       if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//           handleCon();
//       } else {
//           throw err;
//       }
//   })

//         //db changes listenner
// const instance = new MySQLEvents(connection, {
//   startAtEnd: true,
// });
// await instance.start();
// instance.addTrigger({
//   name:'monitoring db changes',
//   expression: 'delivery_system.*',
//   statment: MySQLEvents.STATEMENTS.ALL,
//   onEvent: e => {
//     console.log(e)
//   }
// })


// } //close handleCon function
// handleCon();

        
