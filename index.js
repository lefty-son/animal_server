const express = require('express');
const app = express();
const pg = require('pg');
const bodyParser = require('body-parser')


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('pages/index');
});

app.post('/cloud/store', (request, response) => {
  pg.connect(process.env.DATABASE_URL, (err, client, done) => {
    let desert = request.body.desert.trim();
    let artic = request.body.arctic.trim();
    let grassland = request.body.grassland.trim();
    let jungle = request.body.jungle.trim();
    client.query('SELECT 1 FROM cloud_data WHERE id = $1', [request.body.id], (err, result) => {
      done();
      if (err) {
        console.log(err);
      } else {
        if (result.rowCount == 0) {
          client.query('INSERT INTO cloud_data VALUES($1, $2, $3, $4, $5, $6, $7)',
            [
              request.body.id,
              request.body.desert,
              request.body.arctic,
              request.body.grassland,
              request.body.jungle,
              request.body.gold,
              request.body.relic
            ], (err, result) => {
              if (err) {
                console.log(err);
              } else {
                console.log('insert done');
                response.send('insert done'); //
              }

            });
        } else {
          client.query('UPDATE cloud_data SET desert = $2, arctic = $3, grassland = $4, jungle = $5, gold = $6, relic = $7 WHERE id = $1',
            [
              request.body.id,
              request.body.desert,
              request.body.arctic,
              request.body.grassland,
              request.body.jungle,
              request.body.gold,
              request.body.relic
            ], (err, result) => {
              if (err) {
                console.log(err);
              } else {
                console.log('update done');
                response.send('insert done');
              }
            });
        }

      }
    });
  });
});



app.post('/cloud/load', (request, response) => {
  pg.connect(process.env.DATABASE_URL, (err, client, done) => {
    client.query('SELECT 1 from cloud_data WHERE id = $1', [request.body.id], (err, result) => {
      done();
      if (err) {
        console.log(err);
      } else {
        if (result.rowCount == 0) {
          console.log('nothing to load');
          response.send('nothing');
        } else {
          client.query('SELECT * from cloud_data WHERE id = $1 LIMIT 1', [request.body.id], (err, result) => {
            done();
            if (err) {
              console.log(err);
            } else {
              console.log('load done');
              response.send(result.rows);
            }
          });
        }
      }
    });

  });
});

/* POST SKELETON
app.post('', (request, response) => {
  pg.connect(process.env.DATABASE_URL, (err, client, done) => {
    client.query('', [], (err, result) => {
      done();
      if(err){
      } else {

      }
    });
  });
});
*/
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});


