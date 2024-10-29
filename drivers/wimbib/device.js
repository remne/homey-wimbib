'use strict';

const Homey = require('homey');
const got = require('got');

module.exports = class WimbibDevice extends Homey.Device {

  address = null;

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('WimbibDevice has been initialized');

    const settings = this.getSettings();
    this.log('wimbib address:', settings.wimbib_address);
    this.address = settings.wimbib_address;

    await this.update();

    this.pollTimeout = this.homey.setInterval(async () => {
      await this.update();
    }, 10000);

    // Add a temporary status capability
    //if (!this.hasCapability('status')) {
    //  await this.addCapability('status');
    //  await this.setCapabilityOptions('status', { title: 'Status' });
    //  await this.setCapabilityValue('status', 'Waiting for watermeter radio frames...');
    //}
  }

  async update() {
    this.log('updating WimbibDevice');

    const url = `http://${this.address}/meterData`;
    console.log('fetching data from:', url);

    let responseBody = '';

    try {
      const response = await got(url);
      responseBody = response.body;
    } catch (error) {
      console.error('Error caught while getting meterData', error);
      return;
    }
    const meterData = JSON.parse(responseBody);
    if (meterData == null) {
      console.error(`Unable to parse meterData json from body: ${responseBody}`);
      return;
    }

    //if (!this.hasCapability('measure_rssi')) {
    //  await this.addCapability('measure_rssi');
    //  await this.setCapabilityOptions('measure_rssi', { title: 'Wi-Fi RSSI', units: 'dBm' });
    //}
    //
    //this.setCapabilityValue('measure_rssi', meterData.rssi);

    if ('meter' in meterData) {
      // Update the status capability
      //await this.setCapabilityValue('status', 'Received data from watermeter');
      // await this.removeCapability('status');

      for (const metricKey in meterData.meter) {
        const metricValue = meterData.meter[metricKey];
        const metricInfo = this.getMetricInfo(metricKey);

        if (metricInfo != null) {
          const capability = metricInfo.capability;
          if (!this.hasCapability(capability)) {
            await this.addCapability(capability);
            await this.setCapabilityOptions(capability, { title: metricInfo.desc, units: metricInfo.unit });
          }
          await this.setCapabilityValue(capability, metricValue);
        }
      }
    }
  }

  getMetricInfo(metricKey) {
    const meterInfoKeys = {
      "leak-alarm": {
        desc: "Leak alarm",
        unit: "",
        capability: 'alarm_water.leak'
      },
      "burst-alarm": {
        desc: "Burst alarm",
        unit: "",
        capability: 'alarm_water.burst'
      },
      "dry-alarm": {
        desc: "Dry alarm",
        unit: "",
        capability: 'alarm_water.dry'
      },
      "reverse-alarm": {
        desc: "Reverse alarm",
        unit: "",
        capability: 'alarm_water.reverse'
      },
      "total_volume": {
        desc: "Total volume",
        unit: "m³",
        capability: 'meter_water.total'
      },
      "target_volume": {
        desc: "Target volume",
        unit: "m³",
        capability: 'meter_water.target'
      },
      "flow_actual": {
        desc: "Flow actual",
        unit: "m³/h",
        capability: 'measure_water.flow'
      },
      "max_flow_day": {
        desc: "Max flow day",
        unit: "m³/h",
        capability: 'measure_water.max_flow_day'
      },
      "max_flow_month": {
        desc: "Max flow month",
        unit: "m³/h",
        capability: 'measure_water.max_flow_month'
      },
      "max_flow_year": {
        desc: "Max flow year",
        unit: "m³/h",
        capability: 'measure_water.max_flow_year'
      },
      "min_flow_day": {
        desc: "Min flow day",
        unit: "m³/h",
        capability: 'measure_water.min_flow_day'
      },
      "min_flow_month": {
        desc: "Min flow month",
        unit: "m³/h",
        capability: 'measure_water.min_flow_month'
      },
      "volume_weighted_water_temp_day": {
        desc: "Vol. weighted water temp day",
        unit: "C",
        capability: 'measure_temperature.volume_weighted_water_temp_day'
      },
      "volume_weighted_water_temp_month": {
        desc: "Vol. weighted water temp month",
        unit: "C",
        capability: 'measure_temperature.volume_weighted_water_temp_month'
      },
      "max_water_temp_day": {
        desc: "Max water temp day",
        unit: "C",
        capability: 'measure_temperature.max_water_temp_day'
      },
      "max_water_temp_month": {
        desc: "Max water temp month",
        unit: "C",
        capability: 'measure_temperature.max_water_temp_month'
      },
      "max_water_temp_year": {
        desc: "Max water temp year",
        unit: "C",
        capability: 'measure_temperature.max_water_temp_year'
      },
      "min_water_temp_day": {
        desc: "Min water temp day",
        unit: "C",
        capability: 'measure_temperature.min_water_temp_day'
      },
      "min_water_temp_month": {
        desc: "Min water temp month",
        unit: "C",
        capability: 'measure_temperature.min_water_temp_month'
      },
      "min_water_temp_year": {
        desc: "Min water temp year",
        unit: "C",
        capability: 'measure_temperature.min_water_temp_year'
      },
      "time_weighted_meter_temp_day": {
        desc: "Time weighted meter temp day",
        unit: "C",
        capability: 'measure_temperature.time_weighted_meter_temp_day'
      },
      "max_meter_temp_month": {
        desc: "Max meter temp month",
        unit: "C",
        capability: 'measure_temperature.max_meter_temp_month'
      },
      "max_meter_temp_year": {
        desc: "Max meter temp year",
        unit: "C",
        capability: 'measure_temperature.max_meter_temp_year'
      },
      "min_meter_temp_day": {
        desc: "Min meter temp day",
        unit: "C",
        capability: 'measure_temperature.min_meter_temp_day'
      },
      "min_meter_temp_month": {
        desc: "Min meter temp month",
        unit: "C",
        capability: 'measure_temperature.min_meter_temp_month'
      },
      "min_meter_temp_year": {
        desc: "Min meter temp year",
        unit: "C",
        capability: 'measure_temperature.min_meter_temp_year'
      },
      "instantaneous_flow_temp": {
        desc: "Instantaneous water temperature",
        unit: "C",
        capability: 'measure_temperature.instantaneous_flow_temp'
      },
    };


    if (metricKey in meterInfoKeys) {
      return meterInfoKeys[metricKey];
    }

    return null;
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('WimbibDevice has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log('WimbibDevice settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('WimbibDevice was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('WimbibDevice has been deleted');
    this.homey.clearInterval(this.pollTimeout);
  }


  async onDiscoveryAddressChanged(address) {
    this.log('WimbibDevice discovery address changed to:', address);
    this.address = settings.wimbib_address;
  }

};
