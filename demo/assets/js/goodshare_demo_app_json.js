const demoAppData = {
  "jsonName": "goodshareDemoApp",
  "version": "1.0.0",
  "baseUrl": "../assets/img/",
  "gsSettinngs": {
    "postalCode": 'postal-code_off.png',
    "sensorLocationName": 1,
    "notificationOverload": false,
    "notificationDryingComplete": false,
    "fanAlwaysRunning": false,
    "fanAlwaysWeak": false
  },
  "currentOperationMode": 30,
  "isFirstVisit": {
    "homeScreen": true,
    "opeModeSelection": true,
    "scheduleUpdate": true,
    "modalWindow": true,
  },
  "modes": {
    "mode1": {
      "name": "空調シェア",
      "operations": [
        {
          "id": 11,
          "name": "冷房",
          "imageUrl": "tmp_270.png",
          "modalUrl": "modal_tmp260.png",
          "switchLabel": null
        },
        {
          "id": 12,
          "name": "暖房",
          "imageUrl": "tmp_150.png",
          "modalUrl": "modal_tmp210.png",
          "switchLabel": null
        },
        {
          "id": 13,
          "name": "除湿",
          "imageUrl": "hum_070.png",
          "modalUrl": "modal_hum400.png",
          "switchLabel": null
        }
      ]
    },
    "mode2": {
      "name": "循環シェア",
      "operations": [
        {
          "id": 21,
          "name": "自動",
        }
      ]
    },
    "mode3": {
      "name": "手動操作",
      "operations": [
        {
          "id": 31,
          "name": "冷房",
          "imageUrl": "tmp_270.png",
          "modalUrl": "modal_tmp260.png",
          "switchLabel": null
        },
        {
          "id": 32,
          "name": "暖房",
          "imageUrl": "tmp_150.png",
          "modalUrl": "modal_tmp210.png",
          "switchLabel": null
        },
        {
          "id": 33,
          "name": "除湿",
          "imageUrl": "hum_070.png",
          "modalUrl": "modal_hum400.png",
          "switchLabel": null
        },
        {
          "id": 34,
          "name": "送風",
        },
        {
          "fan": {
            "id": 1
          }
        }
      ]
    },
    "mode4": {
      "name": "衣類乾燥",
      "operations": [
        {
          "id": 41,
          "name": "自動",
          "imageUrl": "timer_off.png",
          "modalUrl": "modal_timer.png",
          "switchLabel": null

        }
      ]
    }
  },
  "sensors": [
    {
      "id": 1,
      "name": "脱衣所",
      "currentTemp": "26.0",
      "currentHumidity": "60"
    },
    {
      "id": 2,
      "name": "玄関",
      "currentTemp": "26.0",
      "currentHumidity": "60"
    },
    {
      "id": 3,
      "name": "ウォークインクローゼット",
      "currentTemp": "26.0",
      "currentHumidity": "60"
    }
  ],
  "modalGsOpeMode": null,
  "modalRacOpeMode": null,
  "modalPropatyValue": null
};

function storeJsonData() {
  try {
    sessionStorage.setItem("demoAppData", JSON.stringify(demoAppData));
  } catch (error) {
    showAlert('E101');
  }
}

storeJsonData();
