const express = require('express');
const axios = require('axios');

const app = express();
const port = 80;

const tvIpAddress = ''; // Replace with your Sony Bravia TV's local IP address
const psk = '' // Replace with PSK from your tv. Settings > Network > Pre-Shared Key
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.post('/power', (req, res) => {
  const status = req.body.status === 'on' ? true : false;

  const data = {
    method: 'setPowerStatus',
    id: 1,
    params: [{ status }],
    version: '1.0',
  };

  const headers = {
    'Content-Type': 'application/json',
    'X-Auth-PSK': psk,
  };

  axios
    .post(`http://${tvIpAddress}/sony/system`, data, { headers })
    .then(response => {
      console.log(response.data);
      res.redirect('/')
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error sending power command');
    });
});

app.post('/hdmi/:num', (req, res) => {
    const inputnum = req.params.num
    const data = {
        "method": "setPlayContent",
        "id": 2,
        "params": [{"uri": `extInput:hdmi?port=${inputnum}`}],
        "version": "1.0"
    };

    const headers = {
        'Content-Type': 'application/json',
        'X-Auth-PSK': psk,
      };
    axios
    .post(`http://${tvIpAddress}/sony/avContent`, data, { headers })
    .then(response => {
      console.log(response.data);
      res.redirect('/')
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error sending power command');
    });

})



app.post('/control', (req, res) =>{
let buttonctrl = req.body.ctrl

let ircc;
switch (buttonctrl){
    case 'OK': 
    ircc = 'AAAAAQAAAAEAAABlAw==';
    break;
    case 'UP': 
    ircc="AAAAAQAAAAEAAAB0Aw==";
    break;
    case 'DOWN': 
    ircc= 'AAAAAQAAAAEAAAB1Aw==';
    break;
    case 'RIGHT': 
    ircc= 'AAAAAQAAAAEAAAAzAw==';
    break;
    case 'LEFT':
    ircc= 'AAAAAQAAAAEAAAA0Aw==';
    break;
    case 'vol-up': 
    ircc= 'AAAAAQAAAAEAAAASAw=='
    break;
    case 'vol-down': 
    ircc = 'AAAAAQAAAAEAAAATAw=='
    break;
    case 'BACK': 
    ircc = 'AAAAAgAAAJcAAAAjAw=='
    break;
    case 'HOME': 
    ircc = 'AAAAAQAAAAEAAABgAw=='
    break;
    case 'INPUT': 
    ircc = 'AAAAAQAAAAEAAAAlAw=='
    break;
}

    const url = `http://${tvIpAddress}/sony/ircc`;
const data = `<?xml version="1.0" encoding="utf-8"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1"><IRCCCode>${ircc}</IRCCCode></u:X_SendIRCC></s:Body></s:Envelope>`;
const headers = {
  'Content-Type': 'text/xml; charset=UTF-8',
  'X-Auth-PSK': psk,
  SOAPACTION: '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"',
};

axios
  .post(url, data, { headers })
  .then(response => {
    res.redirect('/')
  })
  .catch(error => {
    console.error('Failed to send IRCC command:', error);
    
  });
})

app.get('/help', (req, res) =>{
  
    const url = `http://${tvIpAddress}/sony/ircc`;
const data = {
  method: 'getApplicationList',
  id: 100,
  params: [],
  version: '1.0',
};
const headers = {
  'Content-Type': 'application/json',
  'X-Auth-PSK': psk,
};

axios
  .post(url, data, { headers })
  .then(response => {
    const applications = response.data.result[0];
    console.log(applications);
  })
  .catch(error => {
    console.error(error);
  });
  res.send({content: 'done'})
})
app.post('/app', (req, res) => {
    const appName = req.body.app;
  
    let uri;
    switch (appName) {
      case 'prime':
        uri = 'com.sony.dtv.com.amazon.amazonvideo.livingroom.com.amazon.ignition.IgnitionActivity';
        break;
      case 'youtube':
        uri = 'com.sony.dtv.com.google.android.youtube.tv.com.google.android.apps.youtube.tv.activity.ShellActivity';
        break;
      case 'disney':
        uri = 'com.sony.dtv.com.disney.disneyplus.com.bamtechmedia.dominguez.main.MainActivity';
        break;
      case 'netflix':
        uri = 'com.sony.dtv.com.netflix.ninja.com.netflix.ninja.MainActivity';
        break;
      default:
        return res.status(400).send('Invalid app selection');
    }
  
    const data = {
      method: 'setActiveApp',
      id: 3,
      params: [{ uri }],
      version: '1.0',
    };
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-PSK': psk,
    };
  
    axios
      .post(`http://${tvIpAddress}/sony/appControl`, data, { headers })
      .then(response => {
        console.log(response.data);
        res.redirect('/')
      })
      .catch(error => {
        console.error(error);
        res.status(500).send(`Error launching ${appName}`);
      });
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
